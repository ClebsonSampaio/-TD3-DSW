import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Payment, IRent, Person, Car } from "../models/Rent";

interface PaymentFormProps {
  payments?: Payment[];
  rents: IRent[];
  people: Person[];
  cars: Car[];
  onSave: (payment: Payment, editMode: boolean) => void;
}

const PaymentForm = ({
  payments = [],
  rents,
  people,
  cars,
  onSave,
}: PaymentFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [aluguelId, setAluguelId] = useState("");
  const [valor, setValor] = useState(0);
  const [status, setStatus] = useState<"PAGO" | "PENDENTE">("PENDENTE");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (id && payments.length > 0) {
      const current = payments.find((p) => p.id === id);
      if (current) {
        setEditMode(true);
        setAluguelId(current.aluguelId);
        setValor(current.valor);
        setStatus(current.status);
      }
    }
  }, [id, payments]);

  // Atualiza valor automaticamente ao escolher aluguel
  useEffect(() => {
    if (!aluguelId) {
      setValor(0);
      return;
    }
    const rent = rents.find((r) => r.id === Number(aluguelId));
    if (!rent) {
      setValor(0);
      return;
    }
    const car = cars.find((c) => c.id === rent.carId);
    if (!car) {
      setValor(0);
      return;
    }
    // Calcula dias entre datas inclusivo
    const start = new Date(rent.startDate);
    const end = new Date(rent.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setValor(diffDays * car.precoPorDia);
  }, [aluguelId, rents, cars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!aluguelId) {
      alert("Selecione um aluguel.");
      return;
    }
    if (valor <= 0) {
      alert("Valor do pagamento inválido.");
      return;
    }

    const payment: Payment = {
      id: editMode ? (id as string) : Date.now().toString(),
      aluguelId,
      valor,
      status,
    };

    onSave(payment, editMode);
  };

  return (
    <div className="container form-container">
      <h2>{editMode ? "Editar Pagamento" : "Novo Pagamento"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Aluguel:</label>
        <select
          value={aluguelId}
          onChange={(e) => setAluguelId(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {rents.map((r) => {
            const personName = people.find((p) => p.id === r.personId)?.nome;
            const carModel = cars.find((c) => c.id === r.carId)?.modelo;
            return (
              <option key={r.id} value={r.id}>
                {personName} - {carModel} ({r.startDate} até {r.endDate})
              </option>
            );
          })}
        </select>

        <label>Valor (R$):</label>
        <input type="number" value={valor.toFixed(2)} readOnly />

        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "PAGO" | "PENDENTE")}
          required
        >
          <option value="PENDENTE">Pendente</option>
          <option value="PAGO">Pago</option>
        </select>

        <div className="buttons">
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/pagamentos")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
