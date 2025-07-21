import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IRent, Person, Car } from "../models/Rent";

interface RentFormProps {
  people: Person[];
  cars: Car[];
  rents?: IRent[];
  onSave: (rent: IRent, editMode: boolean) => void;
}

const RentForm = ({ people, cars, rents = [], onSave }: RentFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [personId, setPersonId] = useState("");
  const [carId, setCarId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (id && rents.length > 0) {
      const current = rents.find((r) => r.id === Number(id));
      if (current) {
        setEditMode(true);
        setPersonId(current.personId);
        setCarId(current.carId);
        setStartDate(current.startDate);
        setEndDate(current.endDate);
      }
    }
  }, [id, rents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!personId || !carId || !startDate || !endDate) {
      alert("Preencha todos os campos.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("A data final não pode ser anterior à data de início.");
      return;
    }

    const rent: IRent = {
      id: editMode && id ? Number(id) : new Date().getTime(),
      personId,
      carId,
      startDate,
      endDate,
      kmInicial: 0,
    };

    onSave(rent, editMode);
  };

  return (
    <div className="container form-container">
      <h2>{editMode ? "Editar Aluguel" : "Novo Aluguel"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Pessoa:</label>
        <select
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <label>Carro:</label>
        <select
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {cars
            .filter((c) => c.disponivel || c.id === carId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.marca} {c.modelo} ({c.ano})
              </option>
            ))}
        </select>

        <label>Data de início:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>Data final:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <div className="buttons">
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/alugueis")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentForm;
