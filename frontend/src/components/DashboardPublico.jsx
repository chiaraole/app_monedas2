import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardPublico() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PEN");
  const [monedas, setMonedas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/monedas")
      .then((res) => {
        setMonedas(res.data.monedas_disponibles);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!from || !to || !amount) return;

    const convertirAutomaticamente = async () => {
      try {
        const response = await axios.get("http://localhost:8000/convert", {
          params: {
            from_currency: from,
            to_currency: to,
            amount: amount,
          },
        });
        setResultado(response.data);
      } catch (error) {
        console.error("Error en la conversión automática:", error);
        setResultado(null);
      }
    };

    convertirAutomaticamente();
  }, [from, to, amount]);

  const monedaOptions = monedas.map((codigo) => ({ value: codigo, label: codigo }));

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Barra superior */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid #ccc" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Koink</div>
        <div>
        <div>
        <Link to="/login" style={{ marginRight: "1rem", fontSize: "1rem" }}>Ingresa</Link>
        <Link to="/registro" style={{ backgroundColor: "black", color: "white", padding: "0.5rem 1rem", borderRadius: "1rem", textDecoration: "none" }}>Registrarse</Link>
        </div>      
        </div>
      </nav>

      {/* Cuerpo dividido en dos columnas */}
      <main style={{ display: "flex", justifyContent: "space-between", padding: "4rem 15%" }}>
        {/* Sección izquierda */}
        <section style={{ width: "45%" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#555" }}>Cambios de divisas al alcance de tu mano</h2>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "1rem 0" }}>CONVERSOR DE DIVISAS</h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>
            Realiza conversiones, envía dinero y paga directamente desde la app con tipos de cambio que te encantarán y que puedes consultar en tiempo real con nuestro conversor de divisas. Prepárate para descubrir por qué Koink es la opción ideal para ti.
          </p>
        </section>

        {/* Conversor a la derecha */}
        <section
          style={{
            width: "38%",
            backgroundColor: "#f4f4f4",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "left",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Conversor de Divisas</h2>

          <label style={{ display: "block", marginBottom: "0.5rem" }}>Importe</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
          />

          <label style={{ display: "block", marginBottom: "0.5rem" }}>De</label>
          <Select
            options={monedaOptions}
            value={monedaOptions.find((opt) => opt.value === from)}
            onChange={(selected) => setFrom(selected.value)}
            placeholder="Selecciona moneda origen"
            isSearchable
            styles={{ menu: (base) => ({ ...base, zIndex: 999 }) }}
          />

          <label style={{ display: "block", margin: "1rem 0 0.5rem" }}>Convertida a</label>
          <Select
            options={monedaOptions}
            value={monedaOptions.find((opt) => opt.value === to)}
            onChange={(selected) => setTo(selected.value)}
            placeholder="Selecciona moneda destino"
            isSearchable
            styles={{ menu: (base) => ({ ...base, zIndex: 999 }) }}
          />

          <button
            onClick={() => setMostrarModal(true)}
            style={{
              backgroundColor: "black",
              color: "white",
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Empezar
          </button>

          {resultado && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>
                  {amount} {from} = {resultado.converted} {to}
                </strong>
              </p>
              <p>
                Tasa actual: 1 {from} = {resultado.rate} {to}
              </p>
            </div>
          )}

          <p style={{ fontSize: "0.8rem", marginTop: "1.5rem", color: "#777" }}>
            Los tipos de cambio varían constantemente. Verifica el tipo de cambio en tiempo real antes de realizar tu conversión.
          </p>

          {mostrarModal && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center"
            }}>
              <div style={{
                backgroundColor: "white", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "400px", textAlign: "center"
              }}>
                <h2>¿Listo para comenzar?</h2>
                <p style={{ marginBottom: "1.5rem" }}>
                  Regístrate o inicia sesión para acceder a todas las funciones de Koink: transferencias, cuentas afiliadas y más.
                </p>
                <div>
                <Link to="/login" style={{ marginRight: "1rem", fontSize: "1rem" }}>Ingresa</Link>
                <Link to="/registro" style={{ backgroundColor: "black", color: "white", padding: "0.5rem 1rem", borderRadius: "1rem", textDecoration: "none" }}>Registrarse</Link>
                </div>
                <br />
                <button
                  onClick={() => setMostrarModal(false)}
                  style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555", background: "none", border: "none", cursor: "pointer" }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}