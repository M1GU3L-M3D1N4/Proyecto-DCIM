import React from "react";
import { useNavigate } from "react-router-dom";
import mockData from "../../../src/data/mockData.json";
import "./UserCard.css";

/**
 * UserCard
 *
 * Muestra el nombre y rol del usuario actual y expone una acción de logout.
 * Uso previsto: header o sidebar.
 *
 * Comportamiento técnico:
 * - Lee `user` desde `localStorage` y lo parsea como JSON.
 * - Si no hay datos válidos, utiliza `mockData.user` como fallback (desarrollo).
 * - `handleLogout` elimina `user` y `token` de `localStorage` y navega a `/`.
 */
function UserCard() {
  const navigate = useNavigate();

  // Obtiene el usuario desde localStorage en tiempo de ejecución.
  // Leer `user` desde localStorage; en caso de error o ausencia, devolver
  // el usuario de `mockData` como fallback para desarrollo.
  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // Si falla el parseo o el acceso, se ignora el error y se usa el mock.
    }
    return mockData?.user || null;
  })();

  // Cierra la sesión local eliminando credenciales y redirigiendo.
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="user-card">
      {/* Logout: botón con `aria-label` para accesibilidad. */}
      <button className="user-card__logout" onClick={handleLogout} aria-label="Cerrar sesión">
        Cerrar sesión
      </button>
      <div className="user-card__info">
        {/* Mostrar nombre y rol; valores por defecto si están ausentes. */}
        <div className="user-card__name">{user?.name || "Usuario"}</div>
        <div className="user-card__role">{user?.role || "-"}</div>
      </div>
    </div>
  );
}

export default UserCard;
