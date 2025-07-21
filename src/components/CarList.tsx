import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Car } from "../models/Car";
import CarForm from "./CarForm";

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCars = localStorage.getItem("cars");
    if (storedCars) {
      setCars(JSON.parse(storedCars));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cars", JSON.stringify(cars));
  }, [cars]);

  const addCar = (car: Car) => {
    setCars([...cars, car]);
    navigate("/carros");
  };

  const updateCar = (car: Car) => {
    setCars(cars.map((c) => (c.id === car.id ? car : c)));
    navigate("/carros");
  };

  const deleteCar = (id: string) => {
    if (window.confirm("Deseja remover este carro?")) {
      setCars(cars.filter((c) => c.id !== id));
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
                          onClick={() => deleteCar(c.id)}
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
        <Route
          path="editar/:id"
          element={<CarForm cars={cars} onSave={updateCar} />}
        />
      </Routes>
    </div>
  );
}
