export interface IRent {
  id: number;
  personId: string;
  carId: string;
  startDate: string;
  endDate: string;
  kmInicial: number;
}

export interface Person {
  id: string;
  nome: string;
}

export interface Car {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  disponivel: boolean;
  precoPorDia: number;
}

export interface Payment {
  id: string;
  aluguelId: string;
  valor: number;
  status: "PAGO" | "PENDENTE";
}
