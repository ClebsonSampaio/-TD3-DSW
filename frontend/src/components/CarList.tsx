import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Car } from "../models/Car";
import CarForm from "./CarForm";
import {
  getAllCarros,
  createCarro,
  updateCarro,
  deleteCarro,
} from "../services/carroService";
import { toast } from "react-toastify";

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  const loadCarros = async () => {
    try {
      const data = await getAllCarros();
      setCars(data);
    } catch (error) {
      toast.error("Erro ao carregar carros.");
      console.error(error);
    }
  };

  useEffect(() => {
    loadCarros();
  }, []);

  const addCar = async (car: Car) => {
    try {
      await createCarro({
        marca: car.marca,
        modelo: car.modelo,
        ano: car.ano,
        placa: car.placa,
        kmRodado: car.kmRodado,
        precoPorDia: car.precoPorDia,
        disponivel: car.disponivel,
      });
      toast.success("Carro adicionado com sucesso!");
      await loadCarros();
      navigate("/carros");
    } catch (error) {
      toast.error("Erro ao adicionar carro.");
      console.error(error);
    }
  };

  const editCar = async (car: Car) => {
    try {
      await updateCarro(car);
      toast.success("Carro atualizado com sucesso!");
      await loadCarros();
      navigate("/carros");
    } catch (error) {
      toast.error("Erro ao atualizar carro.");
      console.error(error);
    }
  };

  const removeCar = async (id: string) => {
    if (window.confirm("Deseja remover este carro?")) {
      try {
        await deleteCarro(id);
        toast.success("Carro excluído com sucesso!");
        await loadCarros();
      } catch (error) {
        toast.error("Erro ao excluir carro.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Lista de Carros</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1rem 0",
                }}
              >
                <Link to="/carros/novo" className="btn btn-primary">
                  Cadastrar Novo Carro
                </Link>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Ano</th>
                    <th>Placa</th>
                    <th>Km Rodado</th>
                    <th>Preço/dia</th>
                    <th>Disponível</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((c) => (
                    <tr key={c.id}>
                      <td>{c.marca}</td>
                      <td>{c.modelo}</td>
                      <td>{c.ano}</td>
                      <td>{c.placa}</td>
                      <td>{c.kmRodado}</td>
                      <td>R$ {c.precoPorDia.toFixed(2)}</td>
                      <td>{c.disponivel ? "Sim" : "Não"}</td>
                      <td>
                        <Link
                          to={`editar/${c.id}`}
                          className="btn btn-secondary"
                        >
                          Editar
                        </Link>{" "}
                        <button
                          className="btn btn-danger"
                          onClick={() => removeCar(c.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />
        <Route path="novo" element={<CarForm onSave={addCar} />} />
        <Route path="editar/:id" element={<CarForm onSave={editCar} />} />
      </Routes>
    </div>
  );
}
