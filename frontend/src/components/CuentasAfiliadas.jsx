// src/components/CuentasAfiliadas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CuentasAfiliadas() {
  const navigate = useNavigate();
  const [modoOscuro, setModoOscuro] = useState(true);
  const [cuentas, setCuentas] = useState([]);
  const [alias, setAlias] = useState("");
  const [banco, setBanco] = useState("");
  const [numero, setNumero] = useState("");
  const [monedaNueva, setMonedaNueva] = useState("PEN");
  const [monedasDisponibles, setMonedasDisponibles] = useState([]);
  const [monedasUsuario, setMonedasUsuario] = useState([]);

  const [recargaAlias, setRecargaAlias] = useState("");
  const [recargaMonto, setRecargaMonto] = useState("");
  const [recargaMoneda, setRecargaMoneda] = useState("PEN");

  const [transferAlias, setTransferAlias] = useState("");
  const [transferMonto, setTransferMonto] = useState("");
  const [transferMoneda, setTransferMoneda] = useState("PEN");

  const [mensaje, setMensaje] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showRecarga, setShowRecarga] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8000/linked/list", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setCuentas(res.data);
    });

    axios.get("http://localhost:8000/monedas")
      .then((res) => setMonedasDisponibles(res.data.monedas_disponibles));

    axios.get("http://localhost:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setMonedasUsuario(Object.keys(res.data));
    });
  }, []);

  const registrarCuenta = () => {
    if (!alias || !banco || !numero || !monedaNueva) return;

    axios.post("http://localhost:8000/linked/add", {
      alias,
      banco,
      numero,
      moneda: monedaNueva
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setMensaje("✅ Cuenta afiliada registrada exitosamente.");
      setAlias(""); setBanco(""); setNumero(""); setMonedaNueva("PEN");
      setTimeout(() => {
        axios.get("http://localhost:8000/linked/list", {
          headers: { Authorization: `Bearer ${token}` }
        }).then((res) => setCuentas(res.data));
        setShowAdd(false);
      }, 1000);
    }).catch(err => alert(err.response.data.detail));
  };

  const recargar = () => {
    if (!recargaAlias || !recargaMonto || !recargaMoneda) return;

    const cuenta = cuentas.find(c => c.alias === recargaAlias);
    if (!cuenta || cuenta.moneda !== recargaMoneda) {
      return alert("❌ Moneda no coincide con la de la cuenta afiliada.");
    }

    axios.post("http://localhost:8000/linked/deposit", {
      alias: recargaAlias,
      amount: parseFloat(recargaMonto),
      moneda: recargaMoneda
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMensaje(`✅ ${res.data.message}`);
      setRecargaAlias(""); setRecargaMonto(""); setRecargaMoneda("PEN");
      setShowRecarga(false);
    }).catch(err => alert(err.response.data.detail));
  };

  const transferir = () => {
    if (!transferAlias || !transferMonto || !transferMoneda) return;

    const cuenta = cuentas.find(c => c.alias === transferAlias);
    if (!cuenta || cuenta.moneda !== transferMoneda) {
      return alert("❌ Moneda no coincide con la de la cuenta afiliada.");
    }

    axios.post("http://localhost:8000/linked/transfer", {
      alias: transferAlias,
      amount: parseFloat(transferMonto),
      moneda: transferMoneda
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMensaje(`✅ ${res.data.message}`);
      setTransferAlias(""); setTransferMonto(""); setTransferMoneda("PEN");
      setShowTransfer(false);
    }).catch(err => alert(err.response.data.detail));
  };

  const fondo = modoOscuro ? "#121212" : "#f0f0f0";
  const texto = modoOscuro ? "white" : "black";
  const tarjeta = modoOscuro ? "#1f1f1f" : "#eeeeee";

  return (
    <div style={{ backgroundColor: fondo, color: texto, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "0.5rem 1rem", backgroundColor: "#1e90ff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>← Volver al Dashboard</button>
          <button onClick={() => setModoOscuro(!modoOscuro)} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid", borderRadius: "5px", cursor: "pointer", color: texto }}>{modoOscuro ? "Modo Claro" : "Modo Oscuro"}</button>
        </div>

        <h2>🏦 Tus cuentas afiliadas</h2>

        {/* Botones arriba */}
        <div style={{ display: "flex", gap: "1rem", margin: "1rem 0", flexWrap: "wrap" }}>
          <button onClick={() => {
            setShowAdd(true); setShowRecarga(false); setShowTransfer(false);
          }} style={btnEstilo}>➕ Agregar cuenta</button>
          <button onClick={() => {
            setShowAdd(false); setShowRecarga(true); setShowTransfer(false);
          }} style={btnEstilo}>💸 Recargar</button>
          <button onClick={() => {
            setShowAdd(false); setShowRecarga(false); setShowTransfer(true);
          }} style={btnEstilo}>📤 Transferir</button>
        </div>

        {/* Formularios como pantallas exclusivas */}
        {showAdd && (
          <div style={modalEstilo}>
            <h3>➕ Nueva cuenta afiliada</h3>
            <input placeholder="Alias" value={alias} onChange={(e) => setAlias(e.target.value)} style={inputEstilo} />
            <input placeholder="Banco" value={banco} onChange={(e) => setBanco(e.target.value)} style={inputEstilo} />
            <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} style={inputEstilo} />
            <select value={monedaNueva} onChange={(e) => setMonedaNueva(e.target.value)} style={inputEstilo}>
              {monedasDisponibles.map((m) => <option key={m}>{m}</option>)}
            </select>
            <button onClick={registrarCuenta} style={btnEstilo}>Registrar</button>
          </div>
        )}

        {showRecarga && (
          <div style={modalEstilo}>
            <h3>💸 Recargar cuenta</h3>
            <input placeholder="Alias" value={recargaAlias} onChange={(e) => setRecargaAlias(e.target.value)} style={inputEstilo} />
            <input placeholder="Monto" type="number" value={recargaMonto} onChange={(e) => setRecargaMonto(e.target.value)} style={inputEstilo} />
            <select value={recargaMoneda} onChange={(e) => setRecargaMoneda(e.target.value)} style={inputEstilo}>
              {monedasUsuario.map((m) => <option key={m}>{m}</option>)}
            </select>
            <button onClick={recargar} style={btnEstilo}>Recargar</button>
          </div>
        )}

        {showTransfer && (
          <div style={modalEstilo}>
            <h3>📤 Transferir a cuenta afiliada</h3>
            <input placeholder="Alias" value={transferAlias} onChange={(e) => setTransferAlias(e.target.value)} style={inputEstilo} />
            <input placeholder="Monto" type="number" value={transferMonto} onChange={(e) => setTransferMonto(e.target.value)} style={inputEstilo} />
            <select value={transferMoneda} onChange={(e) => setTransferMoneda(e.target.value)} style={inputEstilo}>
              {monedasUsuario.map((m) => <option key={m}>{m}</option>)}
            </select>
            <button onClick={transferir} style={btnEstilo}>Transferir</button>
          </div>
        )}

        {/* Lista de cuentas afiliadas */}
        {cuentas.map((c, i) => (
          <div key={i} style={{ backgroundColor: tarjeta, padding: "1rem", margin: "1rem 0", borderRadius: "0.5rem" }}>
            <p><strong>Alias:</strong> {c.alias}</p>
            <p><strong>Banco:</strong> {c.banco}</p>
            <p><strong>N° Cuenta:</strong> {c.numero}</p>
            <p><strong>Moneda:</strong> {c.moneda}</p>
          </div>
        ))}

        {mensaje && <p style={{ marginTop: "1rem", color: "green" }}>{mensaje}</p>}
      </div>
    </div>
  );
}

const btnEstilo = {
  backgroundColor: "black",
  color: "white",
  padding: "0.75rem 1.25rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem"
};

const inputEstilo = {
  width: "100%",
  padding: "0.5rem",
  marginBottom: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

const modalEstilo = {
  backgroundColor: "#fff",
  color: "#000",
  padding: "2rem",
  borderRadius: "1rem",
  boxShadow: "0 0 20px rgba(0,0,0,0.2)",
  marginTop: "2rem"
};