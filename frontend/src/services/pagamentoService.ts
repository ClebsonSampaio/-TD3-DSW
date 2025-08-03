import api from "./api";
import { Payment } from "../models/Rent";

export async function getAllPagamentos(): Promise<Payment[]> {
  const response = await api.get("/pagamentos");
  return response.data as Payment[];
}

export async function getPagamentoById(id: string): Promise<Payment> {
  const response = await api.get(`/pagamentos/${id}`);
  return response.data as Payment;
}

export async function createPagamento(
  pagamento: Omit<Payment, "id">
): Promise<Payment> {
  const response = await api.post("/pagamentos", pagamento);
  return response.data as Payment;
}

export async function updatePagamento(pagamento: Payment): Promise<Payment> {
  const response = await api.put(`/pagamentos/${pagamento.id}`, pagamento);
  return response.data as Payment;
}

export async function deletePagamento(id: string): Promise<void> {
  await api.delete(`/pagamentos/${id}`);
}
