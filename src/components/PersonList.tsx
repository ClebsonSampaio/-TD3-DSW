import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Person } from "../models/Person";
import PersonForm from "./PersonForm";

export default function PersonList() {
  const [people, setPeople] = useState<Person[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPeople = localStorage.getItem("people");
    if (storedPeople) {
      setPeople(JSON.parse(storedPeople));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  const addPerson = (person: Person) => {
    setPeople([...people, person]);
    navigate("/pessoas");
  };

  const updatePerson = (person: Person) => {
    setPeople(people.map((p) => (p.id === person.id ? person : p)));
    navigate("/pessoas");
  };

  const deletePerson = (id: string) => {
    if (window.confirm("Deseja remover esta pessoa?")) {
      setPeople(people.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Lista de Clientes</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1rem 0",
                }}
              >
                <Link to="/pessoas/nova" className="btn btn-primary">
                  Cadastrar Novo Cliente
                </Link>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.email}</td>
                      <td>{p.telefone}</td>
                      <td>
                        <Link
                          to={`editar/${p.id}`}
                          className="btn btn-secondary"
                        >
                          Editar
                        </Link>{" "}
                        <button
                          className="btn btn-danger"
                          onClick={() => deletePerson(p.id)}
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
        <Route path="nova" element={<PersonForm onSave={addPerson} />} />
        <Route
          path="editar/:id"
          element={<PersonForm people={people} onSave={updatePerson} />}
        />
      </Routes>
    </div>
  );
}
