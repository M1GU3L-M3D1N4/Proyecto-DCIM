import { useNavigate } from "react-router-dom";
import "./UserCard.css";

/**
 * UserCard
 *
 * Muestra el nombre y rol del usuario actual y expone una acción de logout.
 * Uso previsto: header o sidebar.
 *
 * Comportamiento técnico:
 * - Lee `user` desde `localStorage` y lo parsea como JSON.
 * - `handleLogout` elimina `user` y `token` de `localStorage` y navega a `/`.
 */
function UserCard() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      return null;
    }
    return null;
  })();

  // Cierra la sesión local eliminando credenciales y redirigiendo.
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
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
