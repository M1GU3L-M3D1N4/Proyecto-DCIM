import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/modal.css";
// Importar las páginas que se asocian a las rutas del sistema.
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import VendorsList from "./pages/vendors/VendorsList";
import VendorDetail from "./pages/vendors/VendorDetail";
import ModelsList from "./pages/models/ModelsList";
import ModelDetail from "./pages/models/ModelDetail";
import SitesList from "./pages/sites/SitesList";
import RoomsList from "./pages/rooms/RoomsList";
import RacksList from "./pages/racks/RacksList";
import RackDetail from "./pages/racks/RackDetail";
import DevicesList from "./pages/devices/DevicesList";
import DeviceDetail from "./pages/devices/DeviceDetail";

/**
 * Raíz de navegación de la aplicación.
 *
 * Centraliza el enrutado público y privado del frontend para que cada pantalla
 * quede asociada a una URL clara y fácil de mantener.
 */
function App() {
	// El token local determina si el usuario puede entrar a las vistas protegidas.
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("token")));

	// Login utiliza este callback para actualizar la navegación sin recargar la página.
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  // Sincroniza la sesión cuando cambia el almacenamiento o se emite el evento interno de logout.
  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };
  // Escuchar ambos eventos mantiene el estado actualizado entre componentes y pestañas.
    window.addEventListener("auth-change", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("auth-change", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);
  // Redirige al login cualquier ruta que requiera una sesión válida.
  const renderProtectedRoute = (element) => {
    return isAuthenticated ? element : <Navigate to="/" replace />;
  };
  // React Router conecta cada URL con su pantalla y aplica protección según corresponda.
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: pantalla de acceso al sistema. */}
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        {/* Vista principal después del login: resumen y métricas. */}
        <Route path="/dashboard" element={renderProtectedRoute(<Dashboard />)} />
        {/* Catálogos y listados principales. */}
        <Route path="/vendors" element={renderProtectedRoute(<VendorsList />)} />
        <Route path="/vendors/:id" element={renderProtectedRoute(<VendorDetail />)} />
        <Route path="/models" element={renderProtectedRoute(<ModelsList />)} />
        <Route path="/models/:id" element={renderProtectedRoute(<ModelDetail />)} />
        <Route path="/sites" element={renderProtectedRoute(<SitesList />)} />
        <Route path="/rooms" element={renderProtectedRoute(<RoomsList />)} />
        <Route path="/racks" element={renderProtectedRoute(<RacksList />)} />
        {/* Vistas detalladas de entidades individuales. */}
        <Route path="/racks/:id" element={renderProtectedRoute(<RackDetail />)} />
        <Route path="/devices" element={renderProtectedRoute(<DevicesList />)} />
        <Route path="/devices/:id" element={renderProtectedRoute(<DeviceDetail />)} />
      </Routes>
    </BrowserRouter>
  );
}
/** cada ruta se associa a un componente específico, y se redirige si el usuario no está autenticado */
export default App;