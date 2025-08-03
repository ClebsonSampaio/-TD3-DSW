import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { IRent } from "../models/Rent";
import { Car } from "../models/Car";
import { Person } from "../models/Person";
import { Payment } from "../models/Payment";
import PaymentForm from "./PaymentForm";
import {
  getAllPagamentos,
  createPagamento,
  updatePagamento,
  deletePagamento,
} from "../services/pagamentoService";
import { getAllAlugueis } from "../services/aluguelService";
import { getAllPessoas } from "../services/pessoaService";
import { getAllCarros } from "../services/carroService";
import { toast } from "react-toastify";

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
  const location = useLocation();

  const loadData = async () => {
    try {
      const [paymentsData, rentsData, peopleData, carsData] = await Promise.all(
        [getAllPagamentos(), getAllAlugueis(), getAllPessoas(), getAllCarros()]
      );
      setPayments(paymentsData);
      setRents(rentsData);
      setPeople(peopleData);
      setCars(carsData);
    } catch (error) {
      toast.error("Erro ao carregar dados de pagamentos.");
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (payment: Payment, editMode: boolean) => {
    try {
      if (editMode) {
        await updatePagamento(payment);
        toast.success("Pagamento atualizado com sucesso!");
      } else {
        await createPagamento({
          aluguelId: payment.aluguelId,
          valor: payment.valor,
          status: payment.status,
        });
        toast.success("Pagamento criado com sucesso!");
      }
      await loadData();
      navigate("/pagamentos");
    } catch (error) {
      toast.error("Erro ao salvar pagamento.");
      console.error(error);
    }
  };

  const removePayment = async (id: string) => {
    if (!window.confirm("Deseja remover este pagamento?")) return;
    try {
      await deletePagamento(id);
      toast.success("Pagamento removido com sucesso!");
      await loadData();
    } catch (error) {
      toast.error("Erro ao remover pagamento.");
      console.error(error);
    }
  };

  const getPersonName = (personId: string | number) =>
    people.find((p) => String(p.id) === String(personId))?.nome ||
    "Pessoa não encontrada";

  const getCarModel = (carId: string | number) =>
    cars.find((c) => String(c.id) === String(carId))?.modelo ||
    "Carro não encontrado";

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

  const isMainRoute = location.pathname === "/pagamentos";

  return (
    <div className="container">
      <h2>Pagamentos</h2>

      {isMainRoute && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem 0",
            }}
          >
            <Link to="/pagamentos/novo" className="btn btn-primary">
              Baixa de Pagamento
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
                      onClick={() =>
                        navigate(`/pagamentos/editar/${payment.id}`)
                      }
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
            <strong>Total Recebido: </strong> R$ {totalRecebido.toFixed(2)}{" "}
            <br />
            <strong>Total Pendente: </strong> R$ {totalPendente.toFixed(2)}
          </div>
        </>
      )}

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
