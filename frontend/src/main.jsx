// StrictMode ayuda a detectar efectos secundarios durante el desarrollo.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Estilos globales cargados antes de montar la aplicación.
import './index.css'
import App from './App.jsx'

/**
 * Punto de entrada de la aplicación.
 *
 * Renderiza el componente raíz (App) dentro del elemento #root del DOM
 * envuelto en StrictMode para detectar problemas potenciales en desarrollo.
 * StrictMode ayuda a identificar efectos secundarios accidentales durante el renderizado.
 */
// El elemento #root es el punto donde React toma control del documento HTML.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
