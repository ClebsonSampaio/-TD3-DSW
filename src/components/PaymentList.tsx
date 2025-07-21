import { useEffect, useState } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { Payment, IRent, Person, Car } from "../models/Rent";
import PaymentForm from "./PaymentForm";

const formatDateBR = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

const PaymentList = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [rents, setRents] = useState<IRent[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPayments = localStorage.getItem("payments");
    const storedRents = localStorage.getItem("rents");
    const storedPeople = localStorage.getItem("people");
    const storedCars = localStorage.getItem("cars");

    if (storedPayments) setPayments(JSON.parse(storedPayments));
    if (storedRents) setRents(JSON.parse(storedRents));
    if (storedPeople) setPeople(JSON.parse(storedPeople));
    if (storedCars) setCars(JSON.parse(storedCars));
  }, []);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  const removePayment = (id: string) => {
    if (!window.confirm("Deseja remover este pagamento?")) return;
    const updated = payments.filter((p) => p.id !== id);
    setPayments(updated);
  };

  const handleSave = (payment: Payment, editMode: boolean) => {
    if (editMode) {
      setPayments((prev) =>
        prev.map((p) => (p.id === payment.id ? payment : p))
      );
    } else {
      setPayments((prev) => [...prev, payment]);
    }
    navigate("/pagamentos");
  };

  const getPersonName = (personId: string) =>
    people.find((p) => p.id === personId)?.nome || "Pessoa não encontrada";

  const getCarModel = (carId: string) =>
    cars.find((c) => c.id === carId)?.modelo || "Carro não encontrado";

  const getRentDetails = (rentId: string) => {
    const rent = rents.find((r) => r.id === Number(rentId));
    if (!rent) return "Aluguel não encontrado";
    return `${getPersonName(rent.personId)} - ${getCarModel(
      rent.carId
    )} - ${formatDateBR(rent.startDate)} até ${formatDateBR(rent.endDate)}`;
  };

  const totalRecebido = payments
    .filter((p) => p.status === "PAGO")
    .reduce((acc, cur) => acc + cur.valor, 0);

  const totalPendente = payments
    .filter((p) => p.status === "PENDENTE")
    .reduce((acc, cur) => acc + cur.valor, 0);

  return (
    <div className="container">
      <h2>Pagamentos</h2>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}
      >
        <Link to="/pagamentos/novo" className="btn btn-primary">
          Baixa De Pagamento
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Aluguel</th>
            <th>Valor (R$)</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{getRentDetails(payment.aluguelId)}</td>
              <td>R$ {payment.valor.toFixed(2)}</td>
              <td>{payment.status}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/pagamentos/editar/${payment.id}`)}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => removePayment(payment.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <strong>Total Recebido: </strong> R$ {totalRecebido.toFixed(2)} <br />
        <strong>Total Pendente: </strong> R$ {totalPendente.toFixed(2)}
      </div>

      <Routes>
        <Route
          path="novo"
          element={
            <PaymentForm
              rents={rents}
              people={people}
              cars={cars}
              onSave={handleSave}
            />
          }
        />
        <Route
          path="editar/:id"
          element={
            <PaymentForm
              payments={payments}
              rents={rents}
              people={people}
              cars={cars}
              onSave={handleSave}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default PaymentList;
