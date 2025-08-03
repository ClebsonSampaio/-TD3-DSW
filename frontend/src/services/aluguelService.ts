import api from "./api";
import { IRent } from "../models/Rent";

export async function getAllAlugueis(): Promise<IRent[]> {
  const response = await api.get("/alugueis");
  return response.data as IRent[];
}

export async function getAluguelById(id: number): Promise<IRent> {
  const response = await api.get(`/alugueis/${id}`);
  return response.data as IRent;
}

export async function createAluguel(
  aluguel: Omit<IRent, "id">
): Promise<IRent> {
  const response = await api.post("/alugueis", aluguel);
  return response.data as IRent;
}

export async function updateAluguel(aluguel: IRent): Promise<IRent> {
  const response = await api.put(`/alugueis/${aluguel.id}`, aluguel);
  return response.data as IRent;
}

export async function deleteAluguel(id: number): Promise<void> {
  await api.delete(`/alugueis/${id}`);
}
