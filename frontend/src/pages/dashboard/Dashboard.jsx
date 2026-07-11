import { useEffect, useState } from "react";
	import Sidebar from "../../components/layout/Sidebar";
import StatCard from "../../components/StatCard";
import StatusPanel from "../../components/StatusPanel";
import QuickAccess from "../../components/QuickAccess";
import { fetchJson } from "../../lib/dcimApi";
import "./Dashboard.css";

/**
 * Dashboard
 *
 * Vista principal tras autenticación. Composición y datos:
 * - `Sidebar` (navegación lateral)
 * - `StatCard` (métricas cargadas desde la API)
 * - `StatusPanel` (estado derivado desde la API)
 * - `QuickAccess` (enlaces fijos de navegación)
 */
function Dashboard() {
	const [stats, setStats] = useState({ sites: 0, racks: 0, devices: 0 });
	const [statusItems, setStatusItems] = useState([
		{ label: "Activos", count: 0, color: "#10b981" },
		{ label: "Mantenimiento", count: 0, color: "#f59e0b" },
		{ label: "Retirados", count: 0, color: "#6b7280" },
	]);
	const quickAccess = [
		{ title: "Gestión de Sitios", desc: "Ver todos los datacenters", href: "/sites" },
		{ title: "Inventario de Equipos", desc: "Buscar y filtrar equipos", href: "/devices" },
		{ title: "Modelos de Equipos", desc: "Catálogo de hardware", href: "/models" },
	];

	useEffect(() => {
		const loadDashboard = async () => {
			const [sites, racks, devices] = await Promise.all([
				fetchJson("/api/sites", []),
				fetchJson("/api/racks", []),
				fetchJson("/api/devices", []),
			]);

			setStats({
				sites: Array.isArray(sites) ? sites.length : 0,
				racks: Array.isArray(racks) ? racks.length : 0,
				devices: Array.isArray(devices) ? devices.length : 0,
			});

			setStatusItems([
				{ label: "Activos", count: devices.filter((item) => item.status === "active").length, color: "#10b981" },
				{ label: "Mantenimiento", count: devices.filter((item) => item.status === "maintenance").length, color: "#f59e0b" },
				{ label: "Retirados", count: devices.filter((item) => item.status === "retired").length, color: "#6b7280" },
			]);
		};

		loadDashboard();
	}, []);

	return (
			<div className="app-shell">
			<div className="app-shell__sidebar">
				{/* Navegación lateral visible en escritorio. */} 	
				<Sidebar theme="light" />
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
							DCIM - Data Center Infrastructure Management 
						</h1>
						<p className="dashboard__description">
							
						</p>
					</div>
					{/* Métricas resumidas que sirven como punto de partida visual. */}
					<div className="stats-grid">
						<StatCard label="Sitios" value={stats.sites} />
						<StatCard label="Racks" value={stats.racks} />
						<StatCard label="Dispositivos" value={stats.devices} />
					</div>

				{/* Segundo nivel de información: estado de equipos y accesos rápidos. */}
				<div className="dashboard__grid">
					<StatusPanel items={statusItems} />
					<QuickAccess items={quickAccess} />
				</div>

				</section>
			</main>
		</div>
	)
}

export default Dashboard
