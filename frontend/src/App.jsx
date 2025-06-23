import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPublico from "./components/DashboardPublico";
import Registro from "./components/Registro"; // Asegúrate de importar correctamente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPublico />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;