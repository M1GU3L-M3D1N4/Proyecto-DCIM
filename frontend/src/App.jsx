import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: pantalla de acceso al sistema. */}
        <Route path="/" element={<Login />} />
        {/* Vista principal después del login: resumen y métricas. */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catálogos y listados principales. */}
        <Route path="/vendors" element={<VendorsList />} />
        <Route path="/models" element={<ModelsList />} />
        <Route path="/sites" element={<SitesList />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/racks" element={<RacksList />} />
        {/* Vistas detalladas de entidades individuales. */}
        <Route path="/racks/:id" element={<RackDetail />} />
        <Route path="/devices" element={<DevicesList />} />
        <Route path="/devices/:id" element={<DeviceDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;