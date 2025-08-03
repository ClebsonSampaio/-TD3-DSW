import path from "path";
import express from "express";
import cors from "cors";
import { createTables } from "./db/database";
import pessoaRoutes from "./routes/pessoa.routes";
import carroRoutes from "./routes/carro.routes";
import aluguelRoutes from "./routes/aluguel.routes";
import pagamentoRoutes from "./routes/pagamento.routes";

const app = express();

app.use(cors());
app.use(express.json());

createTables();

app.use("/pessoas", pessoaRoutes);
app.use("/carros", carroRoutes);
app.use("/alugueis", aluguelRoutes);
app.use("/pagamentos", pagamentoRoutes);

const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
