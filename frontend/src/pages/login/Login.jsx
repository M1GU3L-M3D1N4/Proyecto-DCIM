import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Datos de prueba
const mockUser = {
  email: "admin@dcim.local",
  password: "admin123",
  name: "Admin User",
  role: "Administrador"
};

/**
 * Pantalla de acceso a la aplicación.
 *
 * Maneja el estado del formulario, valida las credenciales antes de enviarlas
 * y muestra errores o estados de carga para darle feedback al usuario.
 */
function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  // Estado para los campos del formulario.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
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
      // Validar contra datos falsos
      // Cuando haya backend real, reemplazar por fetch a /api/auth/login
      if (email === mockUser.email && password === mockUser.password) {
        const userData = {
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          token: "fake-jwt-token-" + Date.now(),
        };
        console.log("Login exitoso:", userData);
        // Guardar datos en localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        if (onLoginSuccess) onLoginSuccess();
        // Redirigir al dashboard con React Router
        navigate("/dashboard");
      } else {
        throw new Error("Correo o contraseña incorrectos");
      }
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
            <div className="form-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "form-input--error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
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
