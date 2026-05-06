	import Sidebar from "../../components/layout/Sidebar";
import StatCard from "../../components/StatCard";
import StatusPanel from "../../components/StatusPanel";
import QuickAccess from "../../components/QuickAccess";
import "./Dashboard.css";

/**
 * Pantalla principal después del login.
 *
 * Agrupa las vistas más importantes del sistema:
 * - Métricas clave: sitios, racks y dispositivos totales
 * - Estado de los equipos: activos, en mantenimiento, retirados
 * - Acceso rápido a secciones principales
 *
 * Los datos se muestran estáticos por ahora; se conectarán al backend más adelante.
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
						<StatCard label="Sitios" value={0} />
						<StatCard label="Racks" value={0} />
						<StatCard label="Dispositivos" value={0} />
					</div>

				{/* Segundo nivel de información: estado de equipos y accesos rápidos. */}
				<div className="dashboard__grid">
					{/* Panel que muestra el estado actual de los dispositivos por categoría. */}
					<StatusPanel
						items={[
							{ label: 'Activos', count: 0, color: '#10b981' },
							{ label: 'Mantenimiento', count: 0, color: '#f59e0b' },
							{ label: 'Retirados', count: 0, color: '#6b7280' },
						]}
					/>
					{/* Atajos para navegar rápidamente a las secciones más usadas del sistema. */}
					<QuickAccess
						items={[
							{ title: 'Gestión de Sitios', desc: 'Ver todos los datacenters', href: '/sites' },
							{ title: 'Inventario de Equipos', desc: 'Buscar y filtrar equipos', href: '/devices' },
							{ title: 'Modelos de Equipos', desc: 'Catálogo de hardware', href: '/models' },
						]}
					/>
				</div>
				</section>
			</main>
		</div>
	)
}

export default Dashboard
