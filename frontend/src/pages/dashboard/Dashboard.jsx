import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { fetchJson } from "../../lib/dcimApi";
import "./Dashboard.css";

const statusLabels = {
	active: "Activo",
	maintenance: "Mantenimiento",
	retired: "Retirado",
};

const alertColors = {
	critical: "dashboard-alert--critical",
	warning: "dashboard-alert--warning",
	info: "dashboard-alert--info",
};

const formatNumber = (value) => new Intl.NumberFormat("es-CO").format(value || 0);

const formatDateTime = (value, options = {}) => {
	if (!value) return "N/D";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "N/D";
	return date.toLocaleString("es-CO", {
		dateStyle: "medium",
		timeStyle: "medium",
		...options,
	});
};

const getDeviceDateValue = (device) => {
	const installed = device?.installed_at ? new Date(device.installed_at).getTime() : 0;
	if (Number.isFinite(installed) && installed > 0) return installed;
	return Number(device?.device_id) || 0;
};

function Dashboard() {
	const [sites, setSites] = useState([]);
	const [racks, setRacks] = useState([]);
	const [devices, setDevices] = useState([]);
	const [currentTime, setCurrentTime] = useState(() => new Date());

	useEffect(() => {
		const timer = window.setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => window.clearInterval(timer);
	}, []);

	const loadDashboard = async () => {
		const [sitesData, racksData, devicesData] = await Promise.all([
			fetchJson("/api/sites", []),
			fetchJson("/api/racks", []),
			fetchJson("/api/devices", []),
		]);

		setSites(Array.isArray(sitesData) ? sitesData : []);
		setRacks(Array.isArray(racksData) ? racksData : []);
		setDevices(Array.isArray(devicesData) ? devicesData : []);
		setCurrentTime(new Date());
	};

	useEffect(() => {
		loadDashboard();
	}, []);

	const activeCount = devices.filter((device) => device.status === "active").length;
	const maintenanceCount = devices.filter((device) => device.status === "maintenance").length;
	const retiredCount = devices.filter((device) => device.status === "retired").length;
	const racklessCount = devices.filter((device) => !device.rack_id).length;
	const totalDevices = devices.length;

	const totalRackCapacity = racks.reduce((sum, rack) => sum + Number(rack.total_u || 0), 0);
	const totalRackUsed = racks.reduce((sum, rack) => sum + Number(rack.used_units || 0), 0);
	const overallOccupancy = totalRackCapacity > 0 ? Math.round((totalRackUsed / totalRackCapacity) * 100) : 0;
	const freeSpaces = Math.max(totalRackCapacity - totalRackUsed, 0);
	const topRacks = [...racks].sort((a, b) => Number(b.used_percent || 0) - Number(a.used_percent || 0)).slice(0, 5);
	const highUsageRack = topRacks.find((rack) => Number(rack.used_percent || 0) >= 90) || topRacks[0];

	const vendorCounts = Object.values(
		devices.reduce((accumulator, device) => {
			const key = device.vendor_name || "Sin fabricante";
			if (!accumulator[key]) {
				accumulator[key] = { label: key, count: 0 };
			}
			accumulator[key].count += 1;
			return accumulator;
		}, {})
	).sort((a, b) => b.count - a.count);

	const latestDevices = [...devices]
		.sort((a, b) => getDeviceDateValue(b) - getDeviceDateValue(a))
		.slice(0, 5);

	const activityCards = [
		{ label: "Total de equipos", value: formatNumber(totalDevices) },
		{ label: "Rack más ocupado", value: highUsageRack ? highUsageRack.code : "Sin datos" },
		{ label: "Fabricante dominante", value: vendorCounts[0]?.label || "Sin datos" },
		{ label: "Modelo más utilizado", value: devices.length ? devices.reduce((winner, device) => {
			if (!winner) return device;
			const winnerCount = devices.filter((item) => item.model_name === winner.model_name).length;
			const deviceCount = devices.filter((item) => item.model_name === device.model_name).length;
			return deviceCount > winnerCount ? device : winner;
		}, null)?.model_name || "Sin datos" : "Sin datos" },
		{ label: "Equipo más reciente", value: latestDevices[0]?.name || "Sin datos" },
	];

	const alerts = [];
	if (highUsageRack && Number(highUsageRack.used_percent || 0) >= 90) {
		alerts.push({ severity: "critical", text: `Rack ${highUsageRack.code} con ocupación del ${highUsageRack.used_percent}%.` });
	}
	if (maintenanceCount > 0) {
		alerts.push({ severity: maintenanceCount >= 5 ? "critical" : "warning", text: `${formatNumber(maintenanceCount)} equipos en mantenimiento.` });
	}
	if (retiredCount > 0) {
		alerts.push({ severity: "info", text: `${formatNumber(retiredCount)} equipos retirados.` });
	}
	if (racklessCount > 0) {
		alerts.push({ severity: racklessCount >= 3 ? "critical" : "warning", text: `${formatNumber(racklessCount)} equipos sin rack asignado.` });
	}

	const modelWinner = devices.length
		? Object.values(
				devices.reduce((accumulator, device) => {
					const key = device.model_name || "Sin modelo";
					if (!accumulator[key]) accumulator[key] = { label: key, count: 0 };
					accumulator[key].count += 1;
					return accumulator;
				}, {})
			).sort((a, b) => b.count - a.count)[0]
		: null;

	return (
		<div className="app-shell">
			<div className="app-shell__sidebar">
				<Sidebar theme="light" />
			</div>

			<main className="dashboard">
				<section className="dashboard__panel">
					<header className="dashboard__hero">
						<div className="dashboard__hero-copy">
							<p className="dashboard__badge">DCIM Dashboard</p>
							<h1 className="dashboard__title">Data Center Infrastructure Management</h1>
						</div>

						<div className="dashboard__hero-tools">
							<div className="dashboard__clock-card">
								<strong>{formatDateTime(currentTime)}</strong>
							</div>
						</div>
					</header>

					<section className="dashboard__layout">
						<div className="dashboard__column dashboard__column--left">
							<article className="dashboard-card dashboard-card--occupancy">
								<div className="dashboard-card__header">
									<div>
										<p className="dashboard-card__eyebrow">Ocupación de racks</p>
										<h2 className="dashboard-card__title">Ocupación general</h2>
									</div>
									<span className={`dashboard-pill ${overallOccupancy >= 90 ? "dashboard-pill--danger" : overallOccupancy >= 70 ? "dashboard-pill--warning" : "dashboard-pill--success"}`}>
										{overallOccupancy}% ocupado
									</span>
								</div>

								<div className="dashboard-occupancy">
									<div className="dashboard-progress" aria-hidden="true">
										<span style={{ width: `${overallOccupancy}%` }} />
									</div>

									<div className="dashboard-occupancy__grid">
										<div>
											<span>Porcentaje</span>
											<strong>{overallOccupancy}%</strong>
										</div>
										<div>
											<span>Espacios libres</span>
											<strong>{formatNumber(freeSpaces)}</strong>
										</div>
										<div>
											<span>Espacios ocupados</span>
											<strong>{formatNumber(totalRackUsed)}</strong>
										</div>
										<div>
											<span>Capacidad total</span>
											<strong>{formatNumber(totalRackCapacity)}</strong>
										</div>
									</div>

									<div className="dashboard-table-wrap">
										<table className="dashboard-table">
											<thead>
												<tr>
													<th>Rack</th>
													<th>Uso</th>
													<th>Ocupación</th>
												</tr>
											</thead>
											<tbody>
												{topRacks.length === 0 ? (
													<tr>
														<td colSpan="3" className="dashboard-table__empty">No hay racks para mostrar.</td>
													</tr>
												) : (
													topRacks.map((rack) => {
														const rackUsage = Number(rack.used_percent || 0);
														const danger = rackUsage >= 90;

														return (
															<tr key={rack.rack_id} className={danger ? "dashboard-table__row--danger" : ""}>
																<td>
																	<strong>{rack.code}</strong>
																	<span>{rack.room_name || "Sin sala"}</span>
																</td>
																<td>{rackUsage}%</td>
																<td>{formatNumber(rack.used_units || 0)}/{formatNumber(rack.total_u || 0)}U</td>
															</tr>
														);
													})
												)}
											</tbody>
										</table>
									</div>
								</div>
							</article>

							<article className="dashboard-card">
								<div className="dashboard-card__header">
									<div>
										<p className="dashboard-card__eyebrow">Equipos por fabricante</p>
										<h2 className="dashboard-card__title">Distribución horizontal</h2>
									</div>
								</div>

								<div className="dashboard-bars">
									{vendorCounts.length === 0 ? (
										<div className="dashboard-empty">No hay datos de fabricantes.</div>
									) : (
										vendorCounts.slice(0, 6).map((vendor) => {
											const max = vendorCounts[0]?.count || 1;
											return (
												<div key={vendor.label} className="dashboard-bar-item">
													<div className="dashboard-bar-item__meta">
														<strong>{vendor.label}</strong>
														<span>{formatNumber(vendor.count)} equipos</span>
													</div>
													<div className="dashboard-progress dashboard-progress--thin">
														<span style={{ width: `${Math.max((vendor.count / max) * 100, 6)}%` }} />
													</div>
												</div>
											);
										})
									)}
								</div>
							</article>

							<article className="dashboard-card">
									<div className="dashboard-card__header">
										<div>
											<p className="dashboard-card__eyebrow">Actividad reciente</p>
											<h2 className="dashboard-card__title">Resumen rápido</h2>
										</div>
									</div>

									<div className="dashboard-activity dashboard-activity--wide">
										{activityCards.map((item) => (
											<div key={item.label} className="dashboard-activity__card">
												<span>{item.label}</span>
												<strong>{item.value}</strong>
											</div>
										))}
									</div>
								</article>
						</div>

						<div className="dashboard__column dashboard__column--right">
							<article className="dashboard-card dashboard-card--table">
								<div className="dashboard-card__header">
									<div>
										<p className="dashboard-card__eyebrow">Últimos equipos registrados</p>
										<h2 className="dashboard-card__title">Ordenados desde el más reciente</h2>
									</div>
								</div>

								<div className="dashboard-table-wrap">
									<table className="dashboard-table dashboard-table--dense">
										<thead>
											<tr>
												<th>Nombre</th>
												<th>Fabricante</th>
												<th>Modelo</th>
												<th>Rack</th>
												<th>Estado</th>
												<th>Instalación</th>
											</tr>
										</thead>
										<tbody>
											{latestDevices.length === 0 ? (
												<tr>
													<td colSpan="6" className="dashboard-table__empty">No hay equipos registrados.</td>
												</tr>
											) : (
												latestDevices.map((device) => (
													<tr key={device.device_id}>
														<td>
															<strong>{device.name || "Sin nombre"}</strong>
														</td>
														<td>{device.vendor_name || "Sin fabricante"}</td>
														<td>{device.model_name || "Sin modelo"}</td>
														<td>{device.rack_code || "Sin rack"}</td>
														<td>
															<span className={`dashboard-status-chip dashboard-status-chip--${device.status || "unknown"}`}>
																{statusLabels[device.status] || device.status || "N/D"}
															</span>
														</td>
														<td>{formatDateTime(device.installed_at)}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</article>

							<article className="dashboard-card">
									<div className="dashboard-card__header">
										<div>
											<p className="dashboard-card__eyebrow">Estado operativo</p>
											<h2 className="dashboard-card__title">Indicadores clave</h2>
										</div>
									</div>

									<div className="dashboard-mini-grid">
										<div className="dashboard-mini-card dashboard-mini-card--active">
											<span>Activos</span>
											<strong>{formatNumber(activeCount)}</strong>
											<small>Operando normalmente</small>
										</div>
										<div className="dashboard-mini-card dashboard-mini-card--warning">
											<span>Mantenimiento</span>
											<strong>{formatNumber(maintenanceCount)}</strong>
											<small>Requieren revisión</small>
										</div>
										<div className="dashboard-mini-card dashboard-mini-card--muted">
											<span>Retirados</span>
											<strong>{formatNumber(retiredCount)}</strong>
											<small>Fuera de servicio</small>
										</div>
										<div className="dashboard-mini-card dashboard-mini-card--danger">
											<span>Sin rack</span>
											<strong>{formatNumber(racklessCount)}</strong>
											<small>Asignación pendiente</small>
										</div>
									</div>

									<div className="dashboard-mini-note">
										{modelWinner ? `Modelo más utilizado: ${modelWinner.label}` : "No hay datos suficientes para calcular el modelo más utilizado."}
									</div>
								</article>
						</div>
					</section>
				</section>
			</main>
		</div>
	);
}

export default Dashboard;
