// src/components/TransferenciaUsuario.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TransferenciaUsuario() {
  const [toUser, setToUser] = useState("");
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PEN");
  const [monedas, setMonedas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [modoOscuro, setModoOscuro] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8000/monedas")
      .then(res => setMonedas(res.data.monedas_disponibles));
  }, []);

  const transferir = () => {
    if (!toUser || !amount || !fromCurrency || !toCurrency) return;

    axios.post("http://localhost:8000/transactions/send", {
      to_user: toUser,
      amount: parseFloat(amount),
      from_currency: fromCurrency,
      to_currency: toCurrency
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMensaje("✅ " + res.data.message);
      setToUser(""); setAmount(""); setFromCurrency("USD"); setToCurrency("PEN");
    }).catch(err => {
      setMensaje("❌ " + err.response?.data?.detail || "Error");
    });
  };

  const fondo = modoOscuro ? "#121212" : "#f0f0f0";
  const colorTexto = modoOscuro ? "white" : "black";
  const fondoCaja = modoOscuro ? "#1f1f1f" : "white";

  return (
    <div style={{ backgroundColor: fondo, color: colorTexto, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: fondoCaja, padding: "2rem", borderRadius: "1rem", boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0 }}>🔁 Transferencia</h2>
          <button onClick={() => setModoOscuro(!modoOscuro)} style={{ border: "1px solid", background: "none", color: colorTexto, cursor: "pointer", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>
            {modoOscuro ? "Claro" : "Oscuro"}
          </button>
        </div>

        <input placeholder="Usuario destino" value={toUser} onChange={(e) => setToUser(e.target.value)} style={estiloInput} />
        <input type="number" placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} style={estiloInput} />

        <label style={{ display: "block", marginBottom: "0.25rem" }}>De:</label>
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} style={estiloInput}>
          {monedas.map((m) => <option key={m}>{m}</option>)}
        </select>

        <label style={{ display: "block", marginBottom: "0.25rem", marginTop: "1rem" }}>A:</label>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} style={estiloInput}>
          {monedas.map((m) => <option key={m}>{m}</option>)}
        </select>

        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
          <button onClick={transferir} style={estiloBtn}>Transferir</button>
          <button onClick={() => navigate("/dashboard")} style={{ ...estiloBtn, backgroundColor: "gray" }}>🏠 Volver</button>
        </div>

        {mensaje && <p style={{ marginTop: "1rem", color: mensaje.startsWith("✅") ? "green" : "red" }}>{mensaje}</p>}
      </div>
    </div>
  );
}

const estiloInput = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  fontSize: "1rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc"
};

const estiloBtn = {
  backgroundColor: "black",
  color: "white",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "1rem"
};