import React from 'react';
import './StatusPanel.css';

/**
 * Fila individual de estado.
 *
 * Componente auxiliar que renderiza un indicador visual (punto de color),
 * una etiqueta descriptiva y un conteo asociado.
 * Se utiliza dentro de StatusPanel para mostrar cada categoría de estado.
 */
function StatusRow({ color, label, count }) {
  return (
    <div className="status-row">
      {/* Lado izquierdo: punto de color que identifica visualmente el estado. */}
      <div className="status-row__left">
        <span className="status-dot" style={{ background: color }} />
        <span className="status-label">{label}</span>
      </div>
      {/* Lado derecho: cantidad total de elementos en ese estado. */}
      <div className="status-count">{count}</div>
    </div>
  );
}

/**
 * Panel que muestra el estado resumido de los equipos.
 *
 * Recibe un array de items con propiedades:
 * - color: Código hexadecimal para el indicador visual
 * - label: Texto que describe el estado (ej: "Activos", "Mantenimiento")
 * - count: Número de equipos en ese estado
 *
 * Se usa en el dashboard para dar una vista rápida del estado general
 * del datacenter sin necesidad de entrar a detalles.
 */
function StatusPanel({ items = [] }) {
  return (
    <section className="status-panel">
      {/* Encabezado del panel. */}
      <h3 className="status-panel__title">Estado de Equipos</h3>
      {/* Renderiza una fila para cada estado proporcionado. */}
      <div className="status-panel__list">
        {items.map((it) => (
          <StatusRow key={it.label} color={it.color} label={it.label} count={it.count} />
        ))}
      </div>
    </section>
  );
}

export default StatusPanel;
