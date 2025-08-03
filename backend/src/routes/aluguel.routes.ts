import { Router } from "express";
import { openDb } from "../db/database";

const router = Router();

router.get("/", async (req, res) => {
  const db = await openDb();
  const alugueis = await db.all("SELECT * FROM alugueis");
  await db.close();
  res.json(alugueis);
});

router.get("/:id", async (req, res) => {
  const db = await openDb();
  const aluguel = await db.get("SELECT * FROM alugueis WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (!aluguel)
    return res.status(404).json({ message: "Aluguel não encontrado" });
  res.json(aluguel);
});

router.post("/", async (req, res) => {
  const { personId, carId, startDate, endDate, kmInicial } = req.body;

  if (
    !personId ||
    !carId ||
    !startDate ||
    !endDate ||
    kmInicial === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const db = await openDb();

  const car = await db.get("SELECT * FROM carros WHERE id = ?", [carId]);
  if (!car) {
    await db.close();
    return res.status(404).json({ message: "Carro não encontrado" });
  }
  if (car.disponivel === 0) {
    await db.close();
    return res.status(400).json({ message: "Carro já está alugado." });
  }

  const result = await db.run(
    "INSERT INTO alugueis (personId, carId, startDate, endDate, kmInicial) VALUES (?, ?, ?, ?, ?)",
    [personId, carId, startDate, endDate, kmInicial]
  );

  await db.run("UPDATE carros SET disponivel = 0 WHERE id = ?", [carId]);

  await db.close();

  res.status(201).json({
    id: result.lastID,
    personId,
    carId,
    startDate,
    endDate,
    kmInicial,
  });
});

router.put("/:id", async (req, res) => {
  const { personId, carId, startDate, endDate, kmInicial } = req.body;
  const db = await openDb();

  const aluguel = await db.get("SELECT * FROM alugueis WHERE id = ?", [
    req.params.id,
  ]);
  if (!aluguel) {
    await db.close();
    return res.status(404).json({ message: "Aluguel não encontrado" });
  }

  if (aluguel.carId !== carId) {
    await db.run("UPDATE carros SET disponivel = 1 WHERE id = ?", [
      aluguel.carId,
    ]);
    await db.run("UPDATE carros SET disponivel = 0 WHERE id = ?", [carId]);
  }

  await db.run(
    "UPDATE alugueis SET personId = ?, carId = ?, startDate = ?, endDate = ?, kmInicial = ? WHERE id = ?",
    [personId, carId, startDate, endDate, kmInicial, req.params.id]
  );

  await db.close();

  res.json({
    id: req.params.id,
    personId,
    carId,
    startDate,
    endDate,
    kmInicial,
  });
});

router.delete("/:id", async (req, res) => {
  const db = await openDb();

  const aluguel = await db.get("SELECT * FROM alugueis WHERE id = ?", [
    req.params.id,
  ]);
  if (!aluguel) {
    await db.close();
    return res.status(404).json({ message: "Aluguel não encontrado" });
  }

  await db.run("DELETE FROM alugueis WHERE id = ?", [req.params.id]);

  await db.run("UPDATE carros SET disponivel = 1 WHERE id = ?", [
    aluguel.carId,
  ]);

  await db.close();

  res.status(204).send();
});

export default router;
