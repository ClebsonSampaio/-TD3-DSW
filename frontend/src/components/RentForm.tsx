import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IRent } from "../models/Rent";
import { Person } from "../models/Person";
import { Car } from "../models/Car";
import { getAluguelById } from "../services/aluguelService";
import { toast } from "react-toastify";

interface RentFormProps {
  people: Person[];
  cars: Car[];
  onSave: (rent: IRent, editMode: boolean) => void;
}

const RentForm = ({ people, cars, onSave }: RentFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [personId, setPersonId] = useState<string>("");
  const [carId, setCarId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);

  const [diaria, setDiaria] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (id) {
      setEditMode(true);
      getAluguelById(Number(id))
        .then((rent) => {
          setPersonId(String(rent.personId));
          setCarId(String(rent.carId));
          setStartDate(rent.startDate);
          setEndDate(rent.endDate);
        })
        .catch(() => toast.error("Erro ao carregar aluguel."));
    }
  }, [id]);

  useEffect(() => {
    if (carId) {
      const car = cars.find((c) => String(c.id) === carId);
      if (car) {
        setDiaria(car.precoPorDia);
      }
    }
  }, [carId, cars]);

  useEffect(() => {
    if (startDate && endDate && diaria > 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotal(diffDays * diaria);
    } else {
      setTotal(0);
    }
  }, [startDate, endDate, diaria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!personId || !carId || !startDate || !endDate) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("A data final não pode ser anterior à data de início.");
      return;
    }

    const rent: IRent = {
      id: editMode && id ? Number(id) : 0,
      personId: Number(personId),
      carId: Number(carId),
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
            <option key={p.id} value={String(p.id)}>
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
            .filter((c) => c.disponivel || String(c.id) === carId)
            .map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.marca} {c.modelo} ({c.ano}) - Placa: {c.placa}
              </option>
            ))}
        </select>

        {carId && (
          <>
            <p>
              <strong>Valor da diária:</strong> R$ {diaria.toFixed(2)}
            </p>
            <p>
              <strong>Valor total:</strong> R$ {total.toFixed(2)}
            </p>
          </>
        )}

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
