import React from 'react';
import './StatCard.css';

/**
 * Tarjeta reutilizable para mostrar una métrica numérica.
 *
 * Componente pequeño y modular que se usa para destacar números importantes
 * como totales de sitios, racks o dispositivos. Recibe dos props:
 * - label: Nombre descriptivo de la métrica (ej: "Sitios")
 * - value: Valor numérico a mostrar
 *
 * Se puede reutilizar en cualquier panel de resumen o dashboard.
 */
function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      {/* Etiqueta identificadora de la métrica. */}
      <p className="stat-card__label">{label}</p>
      {/* Número principal con mayor peso visual. */}
      <p className="stat-card__value">{value}</p>
    </article>
  );
}

export default StatCard;

/** 
 * Este componente muestra una tarjeta de estadísticas con un valor numérico y una etiqueta descriptiva.
 * Recibe dos props: label (etiqueta) y value (valor) para mostrar la métrica.
 * Se utiliza para destacar números importantes en paneles de resumen o dashboards.
 */