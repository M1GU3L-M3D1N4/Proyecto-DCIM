import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Punto de entrada de la aplicación.
 *
 * Renderiza el componente raíz (App) dentro del elemento #root del DOM
 * envuelto en StrictMode para detectar problemas potenciales en desarrollo.
 * StrictMode ayuda a identificar efectos secundarios accidentales durante el renderizado.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
