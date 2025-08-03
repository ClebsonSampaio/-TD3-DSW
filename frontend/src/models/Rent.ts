export interface IRent {
  id: number;
  personId: number;
  carId: number;
  startDate: string;
  endDate: string;
  kmInicial: number;
}

export interface Payment {
  id: string;
  aluguelId: string;
  valor: number;
  status: "PAGO" | "PENDENTE";
}
