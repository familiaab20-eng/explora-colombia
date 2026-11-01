import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/destinos";

export default function App() {
  const [destinos, setDestinos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDestinos = async () => {
    try {
      setCargando(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al consultar destinos");
      const data = await res.json();
      setDestinos(data);
      setError(null);
    } catch (err) {
      setError("No se pudo conectar con el servidor backend en el puerto 3000.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !departamento.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, departamento })
      });

      if (!res.ok) throw new Error("Error al guardar el destino");

      const nuevo = await res.json();
      setDestinos([...destinos, nuevo]);
      setNombre("");
      setDepartamento("");
    } catch (err) {
      alert("Error al agregar destino");
    }
  };

  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setDestinos(destinos.filter((d) => d.id !== id));
    } catch (err) {
      alert("Error al eliminar el destino");
    }
  };

  return (
    <div className="app-container">
      {/* Barra superior con los colores de la bandera */}
      <div className="colombia-bar">
        <span className="stripe yellow"></span>
        <span className="stripe blue"></span>
        <span className="stripe red"></span>
      </div>

      <header className="hero">
        {/* Bandera de Colombia oficial incorporada en el header */}
        <div className="hero-flag">
          <span className="stripe yellow"></span>
          <span className="stripe blue"></span>
          <span className="stripe red"></span>
        </div>
        
        <div className="hero-content">
          <h1>Explora Colombia</h1>
          <p>Directorio de destinos turísticos y culturales</p>
        </div>
      </header>

      <main className="main-content">
        <section className="form-card">
          <h2>Registrar nuevo destino</h2>
          <form onSubmit={handleSubmit} className="destino-form">
            <div className="input-group">
              <label>Destino</label>
              <input
                type="text"
                placeholder="Ej. Guatapé, Salento..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Departamento</label>
              <input
                type="text"
                placeholder="Ej. Antioquia, Quindío..."
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Agregar
            </button>
          </form>
        </section>

        <section className="destinos-section">
          <h2>Destinos Disponibles</h2>

          {error && <div className="error-box">{error}</div>}
          {cargando && <p className="loading">Cargando datos...</p>}

          {!cargando && !error && destinos.length === 0 && (
            <p className="empty">No hay destinos registrados.</p>
          )}

          <div className="destinos-grid">
            {destinos.map((dest) => (
              <div key={dest.id} className="card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <div className="card-info">
                    <h3>{dest.nombre}</h3>
                    <span className="dept-tag">{dest.departamento}</span>
                  </div>
                  <button
                    onClick={() => handleEliminar(dest.id)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}