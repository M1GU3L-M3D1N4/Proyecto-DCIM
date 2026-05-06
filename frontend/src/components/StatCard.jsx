import React from 'react';
import './StatCard.css';

/**
 * Tarjeta reutilizable para mostrar una métrica resumida.
 *
 * Recibe una etiqueta y un valor para renderizar un bloque compacto y uniforme
 * dentro de paneles de estadísticas o resúmenes visuales.
 */
function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      {/* Nombre corto de la métrica. */}
      <p className="stat-card__label">{label}</p>
      {/* Valor principal asociado a la métrica. */}
      <p className="stat-card__value">{value}</p>
    </article>
  );
}

export default StatCard;
