import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Car } from "../models/Car";
import { getCarroById } from "../services/carroService";
import { toast } from "react-toastify";

interface CarFormProps {
  onSave: (car: Car) => void;
}

const CarForm = ({ onSave }: CarFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState<number | "">("");
  const [placa, setPlaca] = useState("");
  const [kmRodado, setKmRodado] = useState<number | "">("");
  const [precoPorDia, setPrecoPorDia] = useState<number | "">("");
  const [disponivel, setDisponivel] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (id) {
        setEditMode(true);
        try {
          const car = await getCarroById(id);
          setMarca(car.marca);
          setModelo(car.modelo);
          setAno(car.ano);
          setPlaca(car.placa);
          setKmRodado(car.kmRodado);
          setPrecoPorDia(car.precoPorDia);
          setDisponivel(car.disponivel);
        } catch (error) {
          toast.error("Erro ao carregar dados do carro.");
        }
      }
    };
    fetchCar();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !marca ||
      !modelo ||
      ano === "" ||
      !placa ||
      kmRodado === "" ||
      precoPorDia === ""
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const car: Car = {
      id: id || "",
      marca,
      modelo,
      ano: Number(ano),
      placa,
      kmRodado: Number(kmRodado),
      precoPorDia: Number(precoPorDia),
      disponivel,
    };

    onSave(car);
  };

  return (
    <div className="container form-container">
      <h2>{editMode ? "Editar Carro" : "Novo Carro"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Marca:</label>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
        />

        <label>Modelo:</label>
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
        />

        <label>Ano:</label>
        <input
          type="number"
          value={ano}
          onChange={(e) =>
            setAno(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
          min={1900}
          max={2100}
        />

        <label>Placa:</label>
        <input
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          maxLength={7}
          required
        />

        <label>Km Rodado:</label>
        <input
          type="number"
          value={kmRodado}
          onChange={(e) =>
            setKmRodado(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
          min={0}
        />

        <label>Preço por dia:</label>
        <input
          type="number"
          value={precoPorDia}
          onChange={(e) =>
            setPrecoPorDia(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
          min={0}
          step="0.01"
        />

        <label>Disponível:</label>
        <select
          value={disponivel ? "sim" : "nao"}
          onChange={(e) => setDisponivel(e.target.value === "sim")}
        >
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>

        <div className="buttons">
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/carros")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
