// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:8000/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard"); // redirigir a alguna vista privada
    } catch (err) {
      setError("Credenciales inválidas o error de conexión.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "5rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Inicia sesión en Koink</h2>
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
          Iniciar sesión
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
}
