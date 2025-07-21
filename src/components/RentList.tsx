import { useEffect, useState } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { IRent, Person, Car } from "../models/Rent";
import RentForm from "./RentForm";

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

  useEffect(() => {
    const storedRents = localStorage.getItem("rents");
    const storedPeople = localStorage.getItem("people");
    const storedCars = localStorage.getItem("cars");

    if (storedRents) setRents(JSON.parse(storedRents));
    if (storedPeople) setPeople(JSON.parse(storedPeople));
    if (storedCars) setCars(JSON.parse(storedCars));
  }, []);

  useEffect(() => {
    localStorage.setItem("rents", JSON.stringify(rents));
    localStorage.setItem("cars", JSON.stringify(cars));
  }, [rents, cars]);

  const updateCarAvailability = (rentList: IRent[], carList: Car[]) => {
    const rentedCarIds = new Set(rentList.map((r) => r.carId));
    return carList.map((car) => ({
      ...car,
      disponivel: !rentedCarIds.has(car.id),
    }));
  };

  const handleSave = (rent: IRent, editMode: boolean) => {
    let updatedRents: IRent[];

    if (editMode) {
      updatedRents = rents.map((r) => (r.id === rent.id ? rent : r));
    } else {
      updatedRents = [...rents, rent];
    }

    const updatedCars = updateCarAvailability(updatedRents, cars);

    setRents(updatedRents);
    setCars(updatedCars);

    navigate("/alugueis");
  };

  const removeRent = (id: number) => {
    if (!window.confirm("Deseja remover este aluguel?")) return;
    const updated = rents.filter((r) => r.id !== id);
    const updatedCars = updateCarAvailability(updated, cars);
    setRents(updated);
    setCars(updatedCars);
  };

  const getPersonName = (id: string) =>
    people.find((p) => p.id === id)?.nome || "Pessoa não encontrada";
  const getCarModel = (id: string) =>
    cars.find((c) => c.id === id)?.modelo || "Carro não encontrado";

  return (
    <div className="container">
      <h2>Aluguel De Carros</h2>
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
          element={
            <RentForm
              people={people}
              cars={cars}
              rents={rents}
              onSave={handleSave}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default RentList;
