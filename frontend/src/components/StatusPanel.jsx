import React from 'react';
import './StatusPanel.css';

/**
 * Fila individual de estado.
 *
 * Componente pequeño que renderiza un indicador visual (punto de color),
 * una etiqueta descriptiva y un conteo asociado.
 */
function StatusRow({ color, label, count }) {
  return (
    <div className="status-row">
      {/* Lado izquierdo: punto de color e identificador. */}
      <div className="status-row__left">
        <span className="status-dot" style={{ background: color }} />
        <span className="status-label">{label}</span>
      </div>
      {/* Lado derecho: cantidad de elementos en ese estado. */}
      <div className="status-count">{count}</div>
    </div>
  );
}

/**
 * Panel que muestra el estado resumido de los equipos.
 *
 * Recibe una lista de elementos con color, etiqueta y conteo para presentar
 * un resumen visual del estado actual de los dispositivos.
 */
function StatusPanel({ items = [] }) {
  return (
    <section className="status-panel">
      {/* Título del panel. */}
      <h3 className="status-panel__title">Estado de Equipos</h3>
      {/* Lista de estados con indicadores visuales. */}
      <div className="status-panel__list">
        {items.map((it) => (
          <StatusRow key={it.label} color={it.color} label={it.label} count={it.count} />
        ))}
      </div>
    </section>
  );
}

export default StatusPanel;
