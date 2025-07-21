// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PersonList from "./components/PersonList";
import CarList from "./components/CarList";
import RentList from "./components/RentList";
import PaymentList from "./components/PaymentList";

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Gerenciamento Aluguel De Carros</h1>

        <nav className="nav">
          <Link to="/pessoas" className="btn">
            Clientes
          </Link>
          <Link to="/carros" className="btn">
            Carros
          </Link>
          <Link to="/alugueis" className="btn">
            Alugar
          </Link>
          <Link to="/pagamentos" className="btn">
            Pagamentos
          </Link>
        </nav>

        <Routes>
          <Route path="/pessoas/*" element={<PersonList />} />
          <Route path="/carros/*" element={<CarList />} />
          <Route path="/alugueis/*" element={<RentList />} />
          <Route path="/pagamentos/*" element={<PaymentList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
