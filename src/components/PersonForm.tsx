import { useEffect, useState } from "react";
import { Person } from "../models/Person";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onSave: (person: Person) => void;
  people?: Person[];
}

export default function PersonForm({ onSave, people = [] }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (id) {
      const pessoa = people.find((p) => p.id === id);
      if (pessoa) {
        setNome(pessoa.nome);
        setEmail(pessoa.email);
        setTelefone(pessoa.telefone);
      }
    }
  }, [id, people]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !telefone) {
      alert("Preencha todos os campos");
      return;
    }

    const person: Person = {
      id: id || uuidv4(),
      nome,
      email,
      telefone,
    };

    onSave(person);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{id ? "Editar Pessoa" : "Nova Pessoa"}</h2>

      <label>Nome</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Telefone</label>
      <input
        type="tel"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />

      <div className="buttons">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
        <button
          type="button"
          onClick={() => navigate("/pessoas")}
          className="btn btn-secondary"
        >
          Voltar
        </button>
      </div>
    </form>
  );
}
