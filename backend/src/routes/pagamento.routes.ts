import { Router } from "express";
import { openDb } from "../db/database";

const router = Router();

router.get("/", async (req, res) => {
  const db = await openDb();
  const pagamentos = await db.all("SELECT * FROM pagamentos");
  await db.close();
  res.json(pagamentos);
});

router.get("/:id", async (req, res) => {
  const db = await openDb();
  const pagamento = await db.get("SELECT * FROM pagamentos WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (!pagamento)
    return res.status(404).json({ message: "Pagamento não encontrado" });
  res.json(pagamento);
});

router.post("/", async (req, res) => {
  const { aluguelId, valor, status } = req.body;

  if (!aluguelId || valor === undefined || !status) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const db = await openDb();

  const aluguel = await db.get("SELECT * FROM alugueis WHERE id = ?", [
    aluguelId,
  ]);
  if (!aluguel) {
    await db.close();
    return res.status(404).json({ message: "Aluguel não encontrado" });
  }

  const result = await db.run(
    "INSERT INTO pagamentos (aluguelId, valor, status) VALUES (?, ?, ?)",
    [aluguelId, valor, status]
  );
  await db.close();

  res.status(201).json({
    id: result.lastID,
    aluguelId,
    valor,
    status,
  });
});

router.put("/:id", async (req, res) => {
  const { aluguelId, valor, status } = req.body;
  const db = await openDb();

  const pagamento = await db.get("SELECT * FROM pagamentos WHERE id = ?", [
    req.params.id,
  ]);
  if (!pagamento) {
    await db.close();
    return res.status(404).json({ message: "Pagamento não encontrado" });
  }

  await db.run(
    "UPDATE pagamentos SET aluguelId = ?, valor = ?, status = ? WHERE id = ?",
    [aluguelId, valor, status, req.params.id]
  );
  await db.close();

  res.json({
    id: req.params.id,
    aluguelId,
    valor,
    status,
  });
});

router.delete("/:id", async (req, res) => {
  const db = await openDb();
  const result = await db.run("DELETE FROM pagamentos WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (result.changes === 0)
    return res.status(404).json({ message: "Pagamento não encontrado" });

  res.status(204).send();
});

export default router;
