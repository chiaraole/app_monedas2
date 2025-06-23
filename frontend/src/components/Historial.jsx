// src/components/Historial.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Historial() {
  const navigate = useNavigate();
  const [modoOscuro, setModoOscuro] = useState(true);
  const [historial, setHistorial] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [monedaFiltro, setMonedaFiltro] = useState("todas");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/transactions/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHistorial(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const fondo = modoOscuro ? "#121212" : "#f0f0f0";
  const texto = modoOscuro ? "white" : "black";
  const tarjeta = modoOscuro ? "#1f1f1f" : "white";

  const tipos = ["todos", "transfer", "convert"];
  const monedas = [...new Set(historial.flatMap((r) => [r.from_currency, r.to_currency]))];

  const historialFiltrado = historial.filter((r) => {
    const tipoValido =
      tipoFiltro === "todos" ||
      (tipoFiltro === "transfer" && r.from_user !== r.to_user) ||
      (tipoFiltro === "convert" && r.from_user === r.to_user);
    const monedaValida =
      monedaFiltro === "todas" || r.from_currency === monedaFiltro || r.to_currency === monedaFiltro;
    return tipoValido && monedaValida;
  });

  return (
    <div style={{ backgroundColor: fondo, color: texto, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#1e90ff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            ← Volver al Dashboard
          </button>
          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid", borderRadius: "5px", cursor: "pointer", color: texto }}
          >
            {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>

        <h2>🧾 Historial de movimientos</h2>

        <div style={{ display: "flex", gap: "1rem", margin: "1rem 0", flexWrap: "wrap" }}>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} style={inputEstilo}>
            {tipos.map((t) => (
              <option key={t} value={t}>{t === "todos" ? "Todos los tipos" : t === "transfer" ? "Transferencias" : "Conversión interna"}</option>
            ))}
          </select>
          <select value={monedaFiltro} onChange={(e) => setMonedaFiltro(e.target.value)} style={inputEstilo}>
            <option value="todas">Todas las monedas</option>
            {monedas.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {historialFiltrado.length === 0 ? (
          <p style={{ marginTop: "2rem" }}>No hay movimientos registrados.</p>
        ) : (
          historialFiltrado.map((h, i) => (
            <div key={i} style={{ backgroundColor: tarjeta, padding: "1rem", borderRadius: "0.5rem", marginBottom: "1rem" }}>
              <p><strong>Tipo:</strong> {h.from_user === h.to_user ? "Conversión interna" : "Transferencia"}</p>
              <p><strong>De:</strong> {h.from_user} ({h.amount} {h.from_currency})</p>
              <p><strong>Para:</strong> {h.to_user} ({h.converted} {h.to_currency})</p>
              <p><strong>Tasa:</strong> 1 {h.from_currency} = {h.rate} {h.to_currency}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputEstilo = {
  padding: "0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  fontSize: "1rem",
};