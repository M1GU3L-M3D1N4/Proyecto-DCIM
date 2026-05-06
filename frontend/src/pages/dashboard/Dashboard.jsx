import Sidebar from "../../components/layout/Sidebar";
import "./Dashboard.css";

/**
 * Vista principal del sistema.
 *
 * Combina el sidebar de navegación con un panel resumen que muestra el estado
 * general del DCIM y las métricas básicas de referencia.
 */
function Dashboard() {
	return (
			<div className="app-shell">
			<div className="app-shell__sidebar">
				{/* Navegación lateral visible en escritorio. */}
				<Sidebar />
			</div>
			{/* Contenido principal de la pantalla. */}
			<main className="dashboard">
				{/* Tarjeta central con el resumen de la aplicación. */}
				<section className="dashboard__panel">
					{/* Etiqueta corta para ubicar la sección. */}
					<div className="dashboard__badge">
						DCIM Dashboard
					</div>
					{/* Encabezado con título y descripción de contexto. */}
					<div className="dashboard__heading">
						<h1 className="dashboard__title">
							Dashboard del DCIM
						</h1>
						<p className="dashboard__description">
							Bienvenido al Dashboard del DCIM
						</p>
					</div>
					{/* Métricas resumidas que sirven como punto de partida visual. */}
					<div className="stats-grid">
						<article className="stat-card">
							<p className="stat-card__label">Sitios</p>
							<p className="stat-card__value">0</p>
						</article>
						<article className="stat-card">
							<p className="stat-card__label">Racks</p>
							<p className="stat-card__value">0</p>
						</article>
						<article className="stat-card">
							<p className="stat-card__label">Dispositivos</p>
							<p className="stat-card__value">0</p>
						</article>
					</div>
				</section>
			</main>
		</div>
	)
}

export default Dashboard
