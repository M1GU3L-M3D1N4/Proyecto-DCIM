	import Sidebar from "../../components/layout/Sidebar";
import StatCard from "../../components/StatCard";
import StatusPanel from "../../components/StatusPanel";
import QuickAccess from "../../components/QuickAccess";
import mockData from "../../data/mockData.json";
import "./Dashboard.css";

/**
 * Pantalla principal después del login.
 *
 * Agrupa las vistas más importantes del sistema:
 * - Métricas clave: sitios, racks y dispositivos totales
 * - Estado de los equipos: activos, en mantenimiento, retirados
 * - Acceso rápido a secciones principales del sistema
 *
 * Actualmente utiliza datos simulados (mockData.json) para prototipar.
 * Más adelante se conectará al backend para traer datos reales.
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
					<div className="stats-grid">					{/* Estos valores vienen de los datos simulados; se reemplazarán con datos reales del backend. */}					<StatCard label="Sitios" value={mockData.metrics.sites} />
					<StatCard label="Racks" value={mockData.metrics.racks} />
					<StatCard label="Dispositivos" value={mockData.metrics.devices} />
				</div>

				{/* Segundo nivel de información: estado de equipos y accesos rápidos. */}
				<div className="dashboard__grid">
					{/* Panel que muestra el estado actual de los dispositivos por categoría. */}
					{/* Los datos vienen de mockData; se actualizarán desde el backend después. */}
					<StatusPanel items={mockData.equipmentStatus} />
					{/* Atajos para navegar rápidamente a las secciones más usadas del sistema. */}
					{/* Las URLs y descripciones están en mockData por ahora. */}
					<QuickAccess items={mockData.quickAccess} />
				</div>
				</section>
			</main>
		</div>
	)
}

export default Dashboard
