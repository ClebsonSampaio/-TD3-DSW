import api from "./api";
import { Car } from "../models/Car";

export async function getAllCarros(): Promise<Car[]> {
  const response = await api.get("/carros");
  return response.data as Car[];
}

export async function getCarroById(id: string): Promise<Car> {
  const response = await api.get(`/carros/${id}`);
  return response.data as Car;
}

export async function createCarro(carro: Omit<Car, "id">): Promise<Car> {
  const response = await api.post("/carros", carro);
  return response.data as Car;
}

export async function updateCarro(carro: Car): Promise<Car> {
  const response = await api.put(`/carros/${carro.id}`, carro);
  return response.data as Car;
}

export async function deleteCarro(id: string): Promise<void> {
  await api.delete(`/carros/${id}`);
}
