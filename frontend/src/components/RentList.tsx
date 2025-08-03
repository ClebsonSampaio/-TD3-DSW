import { useEffect, useState } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { IRent } from "../models/Rent";
import { Car } from "../models/Car";
import { Person } from "../models/Person";
import RentForm from "./RentForm";
import {
  getAllAlugueis,
  createAluguel,
  updateAluguel,
  deleteAluguel,
} from "../services/aluguelService";
import { getAllPessoas } from "../services/pessoaService";
import { getAllCarros } from "../services/carroService";
import { toast } from "react-toastify";

const formatDateBR = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

const RentList = () => {
  const [rents, setRents] = useState<IRent[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [rentsData, peopleData, carsData] = await Promise.all([
        getAllAlugueis(),
        getAllPessoas(),
        getAllCarros(),
      ]);
      setRents(rentsData);
      setPeople(peopleData);
      setCars(carsData);
    } catch (error) {
      toast.error("Erro ao carregar dados de aluguéis.");
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (rent: IRent, editMode: boolean) => {
    try {
      if (editMode) {
        await updateAluguel(rent);
        toast.success("Aluguel atualizado com sucesso!");
      } else {
        await createAluguel({
          personId: rent.personId,
          carId: rent.carId,
          startDate: rent.startDate,
          endDate: rent.endDate,
          kmInicial: rent.kmInicial,
        });
        toast.success("Aluguel criado com sucesso!");
      }
      await loadData();
      navigate("/alugueis");
    } catch (error) {
      toast.error("Erro ao salvar aluguel.");
      console.error(error);
    }
  };

  const removeRent = async (id: number) => {
    if (!window.confirm("Deseja remover este aluguel?")) return;
    try {
      await deleteAluguel(id);
      toast.success("Aluguel removido com sucesso!");
      await loadData();
    } catch (error) {
      toast.error("Erro ao remover aluguel.");
      console.error(error);
    }
  };

  const getPersonName = (id: string | number) =>
    people.find((p) => String(p.id) === String(id))?.nome ||
    "Pessoa não encontrada";

  const getCarModel = (id: string | number) => {
    const car = cars.find((c) => String(c.id) === String(id));
    return car ? `${car.modelo} - Placa: ${car.placa}` : "Carro não encontrado";
  };

  return (
    <div className="container">
      <h2>Aluguel de Carros</h2>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}
      >
        <Link to="/alugueis/novo" className="btn btn-primary">
          Efetuar Aluguel
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Carro</th>
            <th>Data Início</th>
            <th>Data Final</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rents.map((rent) => (
            <tr key={rent.id}>
              <td>{getPersonName(rent.personId)}</td>
              <td>{getCarModel(rent.carId)}</td>
              <td>{formatDateBR(rent.startDate)}</td>
              <td>{formatDateBR(rent.endDate)}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/alugueis/editar/${rent.id}`)}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => removeRent(rent.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Routes>
        <Route
          path="novo"
          element={<RentForm people={people} cars={cars} onSave={handleSave} />}
        />
        <Route
          path="editar/:id"
          element={<RentForm people={people} cars={cars} onSave={handleSave} />}
        />
      </Routes>
    </div>
  );
};

export default RentList;
