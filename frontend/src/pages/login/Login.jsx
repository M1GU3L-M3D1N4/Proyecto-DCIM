import { useState } from "react";
import "./Login.css";

/**
 * Pantalla de acceso a la aplicación.
 *
 * Maneja el estado del formulario, valida las credenciales antes de enviarlas
 * y muestra errores o estados de carga para darle feedback al usuario.
 */
function Login() {
  // Estado para los campos del formulario.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Errores de validación (por campo) y de envío (global).
  const [errors, setErrors] = useState({});
  // Indica si la petición de login está en progreso.
  const [loading, setLoading] = useState(false);

  // Valida los datos del formulario antes de intentar autenticar.
  // Retorna un objeto con los errores encontrados (vacío si todo está bien).
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "El correo es requerido";
    else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) newErrors.email = "Correo inválido";
    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    return newErrors;
  };

  // Coordina la validación, petición al servidor y manejo de errores.
  // Si hay errores de validación, los muestra sin enviar.
  // Si la validación pasa, limpia errores previos y envía las credenciales.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO: Reemplazar con endpoint real del backend.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      console.log("Login exitoso:", data);
      // TODO: Guardar token en localStorage y redirigir al dashboard.
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Tarjeta centrada que contiene el branding y el formulario. */}
      <div className="login-card">
        {/* Encabezado visual con logo y nombre del sistema. */}
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" className="login-logo-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z" />
              <path d="M12 3v18" />
              <path d="m5 7 7 4 7-4" />
            </svg>
          </div>
          <div>
            <h1 className="login-title">DCIM</h1>
            <p className="login-subtitle">Gestión de Datacenter</p>
          </div>
        </div>

        {/* Formulario de acceso con validación local y feedback inmediato. */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className={`form-input ${errors.email ? "form-input--error" : ""}`}
              placeholder="alguien@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className={`form-input ${errors.password ? "form-input--error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {errors.submit && <p className="form-error form-error--global">{errors.submit}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
