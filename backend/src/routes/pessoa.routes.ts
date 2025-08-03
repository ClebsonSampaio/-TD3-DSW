import { Router } from "express";
import { openDb } from "../db/database";

const router = Router();

router.get("/", async (req, res) => {
  const db = await openDb();
  const pessoas = await db.all("SELECT * FROM pessoas");
  await db.close();
  res.json(pessoas);
});

router.get("/:id", async (req, res) => {
  const db = await openDb();
  const pessoa = await db.get("SELECT * FROM pessoas WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (!pessoa) {
    return res.status(404).json({ message: "Pessoa não encontrada" });
  }

  res.json(pessoa);
});

router.post("/", async (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ message: "Nome e email são obrigatórios." });
  }

  const db = await openDb();
  const result = await db.run(
    "INSERT INTO pessoas (nome, email, telefone) VALUES (?, ?, ?)",
    [nome, email, telefone || null]
  );
  await db.close();

  res.status(201).json({
    id: result.lastID,
    nome,
    email,
    telefone: telefone || null,
  });
});

router.put("/:id", async (req, res) => {
  const { nome, email, telefone } = req.body;
  const db = await openDb();

  const pessoa = await db.get("SELECT * FROM pessoas WHERE id = ?", [
    req.params.id,
  ]);
  if (!pessoa) {
    await db.close();
    return res.status(404).json({ message: "Pessoa não encontrada" });
  }

  await db.run(
    "UPDATE pessoas SET nome = ?, email = ?, telefone = ? WHERE id = ?",
    [nome, email, telefone, req.params.id]
  );
  await db.close();

  res.json({ id: req.params.id, nome, email, telefone });
});

router.delete("/:id", async (req, res) => {
  const db = await openDb();
  const result = await db.run("DELETE FROM pessoas WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (result.changes === 0) {
    return res.status(404).json({ message: "Pessoa não encontrada" });
  }

  res.status(204).send();
});

export default router;
