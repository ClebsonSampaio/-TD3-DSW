import api from "./api";
import { Person } from "../models/Person";

export async function getAllPessoas(): Promise<Person[]> {
  const response = await api.get("/pessoas");
  return response.data as Person[];
}

export async function getPessoaById(id: string): Promise<Person> {
  const response = await api.get(`/pessoas/${id}`);
  return response.data as Person;
}

export async function createPessoa(
  pessoa: Omit<Person, "id">
): Promise<Person> {
  const response = await api.post("/pessoas", pessoa);
  return response.data as Person;
}

export async function updatePessoa(pessoa: Person): Promise<Person> {
  const response = await api.put(`/pessoas/${pessoa.id}`, pessoa);
  return response.data as Person;
}

export async function deletePessoa(id: string): Promise<void> {
  await api.delete(`/pessoas/${id}`);
}
