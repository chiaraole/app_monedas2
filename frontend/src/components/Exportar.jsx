import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Exportar() {
  const [formato, setFormato] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [modoOscuro, setModoOscuro] = useState(true);
  const navigate = useNavigate();

  const fondo = modoOscuro ? "#121212" : "#f0f0f0";
  const texto = modoOscuro ? "white" : "black";

  const descargarArchivo = async () => {
    if (!formato) return;

    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8000/export?formato=${formato}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], { type: formato === "csv" ? "text/csv" : "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `historial.${formato}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMensaje(`✅ Archivo ${formato.toUpperCase()} descargado correctamente.`);
    } catch (error) {
      setMensaje("❌ No hay historial para exportar.");
    }
  };

  return (
    <div style={{ backgroundColor: fondo, color: texto, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <button onClick={() => navigate("/dashboard")} style={botonNavegar}>← Volver</button>
          <button onClick={() => setModoOscuro(!modoOscuro)} style={{ ...botonNavegar, border: "1px solid", backgroundColor: "transparent", color: texto }}>
            {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>

        <h2>📤 Exportar historial</h2>
        <p>Selecciona el formato en el que deseas descargar tu historial de transacciones.</p>

        <select value={formato} onChange={(e) => setFormato(e.target.value)} style={estiloSelect}>
          <option value="">Seleccionar formato</option>
          <option value="csv">CSV</option>
          <option value="xml">XML</option>
        </select>

        <button onClick={descargarArchivo} style={botonDescarga}>Descargar</button>

        {mensaje && <p style={{ marginTop: "1rem" }}>{mensaje}</p>}
      </div>
    </div>
  );
}

const botonNavegar = {
  padding: "0.5rem 1rem",
  backgroundColor: "#1e90ff",
  color: "white",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer"
};

const botonDescarga = {
  marginTop: "1rem",
  padding: "0.75rem 1.5rem",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  cursor: "pointer"
};

const estiloSelect = {
  marginTop: "1rem",
  width: "100%",
  padding: "0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  fontSize: "1rem"
};