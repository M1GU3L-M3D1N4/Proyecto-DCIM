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
