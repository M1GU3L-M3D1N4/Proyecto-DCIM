import React from 'react';
import './QuickAccess.css';

/**
 * Panel de acceso rápido a secciones principales.
 *
 * Muestra una lista de enlaces navegables con título y descripción
 * para que el usuario pueda saltar rápidamente a secciones clave.
 */
function QuickAccess({ items = [] }) {
  return (
    <section className="quick-access">
      {/* Título del panel. */}
      <h3 className="quick-access__title">Acceso Rápido</h3>
      {/* Lista de atajos navegables. */}
      <ul className="quick-access__list">
        {items.map((it) => (
          <li key={it.title} className="quick-access__item">
            <a href={it.href} className="quick-access__link">
              {/* Información del atajo: título y descripción. */}
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
