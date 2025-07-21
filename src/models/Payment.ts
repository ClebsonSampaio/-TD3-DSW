export interface Payment {
  id: string;
  aluguelId: string;
  valor: number;
  status: "PAGO" | "PENDENTE";
}
