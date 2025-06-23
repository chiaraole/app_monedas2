// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCuentas(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!cuentas) return <p style={{ textAlign: "center", marginTop: "5rem" }}>Cargando datos...</p>;

  const fondo = modoOscuro ? "#121212" : "#f0f0f0";
  const colorTexto = modoOscuro ? "white" : "black";

  return (
    <div style={{ backgroundColor: fondo, color: colorTexto, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>👋 Bienvenido a tu panel de Koink</h1>
          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            style={{ background: "none", border: "1px solid", padding: "0.5rem 1rem", cursor: "pointer", color: colorTexto }}
          >
            {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>

        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>💰 Tus saldos:</h2>
        <ul>
          {Object.entries(cuentas).map(([moneda, saldo]) => (
            <li key={moneda} style={{ marginBottom: "0.5rem" }}>
              <strong>{moneda}</strong>: {saldo.toFixed(2)}
            </li>
          ))}
        </ul>

        <hr style={{ margin: "2rem 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <Tarjeta modoOscuro={modoOscuro} titulo="Cuentas afiliadas" onClick={() => navigate("/cuentas")} descripcion="Administra tus cuentas frecuentes para enviar dinero fácilmente." />
          <Tarjeta modoOscuro={modoOscuro} titulo="Transferir a usuario" onClick={() => navigate("/transferencias/usuario")} descripcion="Envía dinero a otros usuarios de Koink." />
          <Tarjeta modoOscuro={modoOscuro} titulo="Convertir moneda" onClick={() => navigate("/transferencias/convertir")} descripcion="Convierte entre tus monedas usando la mejor tasa actual." />
          <Tarjeta modoOscuro={modoOscuro} titulo="Historial" onClick={() => navigate("/historial")} descripcion="Consulta tus movimientos y operaciones anteriores." />
          <Tarjeta modoOscuro={modoOscuro} titulo="Exportar" onClick={() => navigate("/exportar")} descripcion="Genera un archivo con tu historial de movimientos." />
          <Tarjeta modoOscuro={modoOscuro} titulo="Cerrar sesión" onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }} descripcion="Finaliza tu sesión y vuelve al inicio." rojo />
        </div>
      </div>
    </div>
  );
}

function Tarjeta({ titulo, descripcion, onClick, rojo, modoOscuro }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: rojo ? "#e63946" : modoOscuro ? "#1f1f1f" : "white",
        color: rojo ? "white" : modoOscuro ? "white" : "black",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: modoOscuro ? "0 4px 12px rgba(255,255,255,0.05)" : "0 4px 12px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>{titulo}</h3>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{descripcion}</p>
    </div>
  );
}