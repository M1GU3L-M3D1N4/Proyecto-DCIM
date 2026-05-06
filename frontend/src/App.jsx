import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import VendorsList from "./pages/vendors/VendorsList";
import ModelsList from "./pages/models/ModelsList";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const renderProtectedRoute = (element) => {
    return isAuthenticated ? element : <Navigate to="/" replace />;
  };

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
        <Route path="/models" element={renderProtectedRoute(<ModelsList />)} />
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

export default App;