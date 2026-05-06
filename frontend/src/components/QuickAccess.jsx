import React from 'react';
import './QuickAccess.css';

/**
 * Panel de acceso rápido a secciones principales.
 *
 * Muestra una lista de enlaces navegables con título y descripción
 * para que el usuario pueda saltar rápidamente a secciones clave.
 *
 * Recibe un array de items con propiedades:
 * - title: Nombre de la sección (ej: "Gestión de Sitios")
 * - desc: Descripción breve de qué hace esa sección
 * - href: URL a la que enlaza
 *
 * Se usa típicamente en el dashboard para facilitar la navegación.
 */
function QuickAccess({ items = [] }) {
  return (
    <section className="quick-access">
      {/* Encabezado del panel. */}
      <h3 className="quick-access__title">Acceso Rápido</h3>
      {/* Lista de atajos navegables hacia secciones principales. */}
      <ul className="quick-access__list">
        {items.map((it) => (
          <li key={it.title} className="quick-access__item">
            <a href={it.href} className="quick-access__link">
              {/* Información del atajo: título y descripción breve. */}
              <div className="quick-access__meta">
                <div className="quick-access__label">{it.title}</div>
                <div className="quick-access__desc">{it.desc}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuickAccess;
