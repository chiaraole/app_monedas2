// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPublico from "./components/DashboardPublico";
import Registro from "./components/Registro";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // 👈 nuevo
import CuentasAfiliadas from "./components/CuentasAfiliadas";
import TransferenciaUsuario from "./components/TransferenciaUsuario";
import ConvertirMoneda from "./components/ConvertirMoneda";
import Historial from "./components/Historial";
import Exportar from "./components/Exportar"; 

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPublico />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* 👈 agregado */}
        <Route path="/cuentas" element={<CuentasAfiliadas />} />
        <Route path="/transferencias/usuario" element={<TransferenciaUsuario />} />
        <Route path="/transferencias/convertir" element={<ConvertirMoneda />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/exportar" element={<Exportar />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);