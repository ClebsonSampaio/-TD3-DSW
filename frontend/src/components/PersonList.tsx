import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Person } from "../models/Person";
import PersonForm from "./PersonForm";
import {
  getAllPessoas,
  createPessoa,
  updatePessoa,
  deletePessoa,
} from "../services/pessoaService";
import { toast } from "react-toastify";

export default function PersonList() {
  const [people, setPeople] = useState<Person[]>([]);
  const navigate = useNavigate();

  const loadPessoas = async () => {
    try {
      const data = await getAllPessoas();
      setPeople(data);
    } catch (error) {
      toast.error("Erro ao carregar pessoas.");
      console.error(error);
    }
  };

  useEffect(() => {
    loadPessoas();
  }, []);

  const addPerson = async (person: Person) => {
    try {
      await createPessoa({
        nome: person.nome,
        email: person.email,
        telefone: person.telefone,
      });
      toast.success("Pessoa adicionada com sucesso!");
      await loadPessoas();
      navigate("/pessoas");
    } catch (error) {
      toast.error("Erro ao adicionar pessoa.");
      console.error(error);
    }
  };

  const editPerson = async (person: Person) => {
    try {
      await updatePessoa(person);
      toast.success("Pessoa atualizada com sucesso!");
      await loadPessoas();
      navigate("/pessoas");
    } catch (error) {
      toast.error("Erro ao atualizar pessoa.");
      console.error(error);
    }
  };

  const removePerson = async (id: string) => {
    if (window.confirm("Deseja remover esta pessoa?")) {
      try {
        await deletePessoa(id);
        toast.success("Pessoa excluída com sucesso!");
        await loadPessoas();
      } catch (error) {
        toast.error("Erro ao excluir pessoa.");
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
                          onClick={() => removePerson(p.id)}
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
          element={<PersonForm people={people} onSave={editPerson} />}
        />
      </Routes>
    </div>
  );
}
