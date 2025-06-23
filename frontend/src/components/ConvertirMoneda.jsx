// src/components/ConvertirMoneda.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ConvertirMoneda() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState("");
  const [deMoneda, setDeMoneda] = useState("");
  const [aMoneda, setAMoneda] = useState("");
  const [monedasUsuario, setMonedasUsuario] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [modoOscuro, setModoOscuro] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const monedas = Object.keys(res.data);
        setMonedasUsuario(monedas);
        setDeMoneda(monedas[0]);
        setAMoneda(monedas[1] || monedas[0]);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  const convertir = () => {
    if (!monto || !deMoneda || !aMoneda || deMoneda === aMoneda) {
      setMensaje("Completa todos los campos correctamente.");
      return;
    }

    axios
      .post(
        "http://localhost:8000/transactions/convert-self",
        {
          to_user: "", // backend usa el usuario autenticado como destino
          amount: parseFloat(monto),
          from_currency: deMoneda,
          to_currency: aMoneda,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMensaje(`✅ ${res.data.message || "Conversión exitosa"}`);
        setMonto("");
      })
      .catch((err) => {
        const msg = err.response?.data?.detail || "Error al convertir.";
        setMensaje(`❌ ${msg}`);
      });
  };

  const fondo = modoOscuro ? "#121212" : "#f0f0f0";
  const texto = modoOscuro ? "white" : "black";

  return (
    <div style={{ backgroundColor: fondo, color: texto, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#1e90ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ← Volver al Dashboard
          </button>
          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            style={{
              background: "transparent",
              border: "1px solid",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: texto,
              borderRadius: "5px",
            }}
          >
            {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🔄 Convertir entre mis monedas</h2>

        <input
          type="number"
          placeholder="Monto a convertir"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={inputEstilo}
        />

        <select value={deMoneda} onChange={(e) => setDeMoneda(e.target.value)} style={inputEstilo}>
          {monedasUsuario.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select value={aMoneda} onChange={(e) => setAMoneda(e.target.value)} style={inputEstilo}>
          {monedasUsuario.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <button onClick={convertir} style={btnEstilo}>
          Convertir
        </button>

        {mensaje && <p style={{ marginTop: "1rem", color: "lightgreen" }}>{mensaje}</p>}
      </div>
    </div>
  );
}

const inputEstilo = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const btnEstilo = {
  width: "100%",
  backgroundColor: "black",
  color: "white",
  padding: "0.75rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
};