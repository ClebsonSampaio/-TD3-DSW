import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Payment, IRent } from "../models/Rent";
import { Person } from "../models/Person";
import { Car } from "../models/Car";
import { toast } from "react-toastify";

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
  const { id } = useParams<{ id: string }>();

  const [aluguelId, setAluguelId] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [diaria, setDiaria] = useState<number>(0);
  const [qtdDiarias, setQtdDiarias] = useState<number>(0);
  const [status, setStatus] = useState<"PAGO" | "PENDENTE">("PENDENTE");
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (id && payments.length > 0) {
      const current = payments.find((p) => p.id === id);
      if (current) {
        setEditMode(true);
        setAluguelId(String(current.aluguelId));
        setValor(current.valor);
        setStatus(current.status);
      }
    }
  }, [id, payments]);

  useEffect(() => {
    if (!aluguelId) {
      setValor(0);
      setDiaria(0);
      setQtdDiarias(0);
      return;
    }

    const rent = rents.find((r) => String(r.id) === aluguelId);
    if (!rent) {
      setValor(0);
      setDiaria(0);
      setQtdDiarias(0);
      return;
    }

    const car = cars.find((c) => String(c.id) === String(rent.carId));
    if (!car) {
      setValor(0);
      setDiaria(0);
      setQtdDiarias(0);
      return;
    }

    const start = new Date(rent.startDate);
    const end = new Date(rent.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setDiaria(car.precoPorDia);
    setQtdDiarias(diffDays);
    setValor(diffDays * car.precoPorDia);
  }, [aluguelId, rents, cars]);

  const formatDateBR = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!aluguelId) {
      toast.error("Selecione um aluguel.");
      return;
    }
    if (valor <= 0) {
      toast.error("Valor do pagamento inválido.");
      return;
    }

    const payment: Payment = {
      id: editMode ? (id as string) : "",
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
            const personName =
              people.find((p) => String(p.id) === String(r.personId))?.nome ||
              "Cliente não encontrado";
            const carData = cars.find((c) => String(c.id) === String(r.carId));
            const carInfo = carData
              ? `${carData.modelo} - Placa: ${carData.placa}`
              : "Carro não encontrado";
            return (
              <option key={r.id} value={String(r.id)}>
                {personName} - {carInfo} ({formatDateBR(r.startDate)} até{" "}
                {formatDateBR(r.endDate)})
              </option>
            );
          })}
        </select>

        {aluguelId && (
          <div className="payment-info">
            <p>
              <strong>Valor da diária:</strong> R$ {diaria.toFixed(2)}
            </p>
            <p>
              <strong>Quantidade de diárias:</strong> {qtdDiarias}
            </p>
            <p>
              <strong>Valor total:</strong> R$ {valor.toFixed(2)}
            </p>
          </div>
        )}

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
            {editMode ? "Atualizar" : "Salvar"}
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
