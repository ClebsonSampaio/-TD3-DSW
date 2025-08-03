import { Router } from "express";
import { openDb } from "../db/database";

const router = Router();

router.get("/", async (req, res) => {
  const db = await openDb();
  const carros = await db.all("SELECT * FROM carros");
  await db.close();

  const result = carros.map((c: any) => ({
    ...c,
    disponivel: !!c.disponivel,
  }));

  res.json(result);
});

router.get("/:id", async (req, res) => {
  const db = await openDb();
  const carro = await db.get("SELECT * FROM carros WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (!carro) return res.status(404).json({ message: "Carro não encontrado" });

  carro.disponivel = !!carro.disponivel;
  res.json(carro);
});

router.post("/", async (req, res) => {
  const { marca, modelo, ano, precoPorDia, disponivel, placa, kmRodado } =
    req.body;

  if (
    !marca ||
    !modelo ||
    !ano ||
    !precoPorDia ||
    !placa ||
    kmRodado === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const db = await openDb();
  const result = await db.run(
    "INSERT INTO carros (marca, modelo, ano, precoPorDia, disponivel, placa, kmRodado) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [marca, modelo, ano, precoPorDia, disponivel ? 1 : 0, placa, kmRodado]
  );
  await db.close();

  res.status(201).json({
    id: result.lastID,
    marca,
    modelo,
    ano,
    precoPorDia,
    disponivel: !!disponivel,
    placa,
    kmRodado,
  });
});

router.put("/:id", async (req, res) => {
  const { marca, modelo, ano, precoPorDia, disponivel, placa, kmRodado } =
    req.body;
  const db = await openDb();

  const carro = await db.get("SELECT * FROM carros WHERE id = ?", [
    req.params.id,
  ]);
  if (!carro) {
    await db.close();
    return res.status(404).json({ message: "Carro não encontrado" });
  }

  await db.run(
    "UPDATE carros SET marca = ?, modelo = ?, ano = ?, precoPorDia = ?, disponivel = ?, placa = ?, kmRodado = ? WHERE id = ?",
    [
      marca,
      modelo,
      ano,
      precoPorDia,
      disponivel ? 1 : 0,
      placa,
      kmRodado,
      req.params.id,
    ]
  );
  await db.close();

  res.json({
    id: req.params.id,
    marca,
    modelo,
    ano,
    precoPorDia,
    disponivel: !!disponivel,
    placa,
    kmRodado,
  });
});

router.delete("/:id", async (req, res) => {
  const db = await openDb();
  const result = await db.run("DELETE FROM carros WHERE id = ?", [
    req.params.id,
  ]);
  await db.close();

  if (result.changes === 0)
    return res.status(404).json({ message: "Carro não encontrado" });

  res.status(204).send();
});

export default router;
