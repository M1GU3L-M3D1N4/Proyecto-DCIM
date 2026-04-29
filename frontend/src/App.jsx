import { BrowserRouter, Routes, Route } from "react-router-dom";  
// Importamos los componentes de las páginas y el enrutador de React Router todo esto pertence a la libreria react-router-dom
import Vendors from "./pages/Vendors";    
import DeviceModels from "./pages/DeviceModels";
import Sites from "./pages/Sites";
import Rooms from "./pages/Rooms";
import Racks from "./pages/Racks";
// Importamos los componentes de las paginas creadas en la carpeta pages

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Vendors />} /> 
        <Route path="/models" element={<DeviceModels />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/racks" element={<Racks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// Esta parte del código es la configuración de las rutas de la aplicación. Cada ruta se asocia con un componente que se renderiza cuando el usuario navega a esa ruta específica. 
// Por ejemplo, cuando el usuario navega a "/models", se renderiza el componente DeviceModels.
// Finalmente, exportamos el componente App para que pueda ser utilizado en otros archivos de la aplicación.
// El primer route con path="/" se asocia con el componente Vendors, lo que significa que cuando el usuario navega a la raíz de la aplicación, se renderiza el componente Vendors.