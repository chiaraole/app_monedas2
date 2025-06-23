// src/components/Registro.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://localhost:8000/auth/register", form);
      setSuccess("Registro exitoso. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Error inesperado";
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "5rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Crea tu cuenta en Koink</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre de usuario</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <label>Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{9}"
          placeholder="Ej. 987654321"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1.5rem" }}
        />

        <button
          type="submit"
          style={{ backgroundColor: "black", color: "white", padding: "0.75rem", width: "100%", border: "none", borderRadius: "0.5rem" }}
        >
          Registrarse
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}
      </form>
    </div>
  );
}