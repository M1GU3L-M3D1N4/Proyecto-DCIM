import { BrowserRouter, Routes, Route } from "react-router-dom";
// Importamos los componentes de las páginas y el enrutador de React Router todo esto pertence a la libreria react-router-dom

import Dashboard from "./pages/dashboard/Dashboard";
import VendorsList from "./pages/vendors/VendorsList";
import ModelsList from "./pages/models/ModelsList";
import SitesList from "./pages/sites/SitesList";
import RoomsList from "./pages/rooms/RoomsList";
import RacksList from "./pages/racks/RacksList";
import RackDetail from "./pages/racks/RackDetail";
import DevicesList from "./pages/devices/DevicesList";
import DeviceDetail from "./pages/devices/DeviceDetail";
// Importamos los componentes de las páginas que hemos creado para cada ruta

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendors" element={<VendorsList />} />
        <Route path="/models" element={<ModelsList />} />
        <Route path="/sites" element={<SitesList />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/racks" element={<RacksList />} />
        <Route path="/racks/:id" element={<RackDetail />} />
        <Route path="/devices" element={<DevicesList />} />
        <Route path="/devices/:id" element={<DeviceDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// Esta funcion define la estructura de rutas de nuestra aplicación utilizando React Router. 
// Cada ruta está asociada a un componente que se renderiza cuando el usuario navega a esa ruta específica.
// se importan las rutas de las paginas vendors, models, sites, rooms, racks y devices, ademas de los detalles de racks y devices.
// se exporta el componente App para que pueda ser utilizado en otros archivos de la aplicación.