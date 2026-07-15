import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { fetchJson } from "../../lib/dcimApi";
import ModelEditForm from "./ModelEditForm";
import DeviceEditForm from "../devices/DeviceEditForm";
import "./ModelsList.css";

const sortDevicesByUnit = (items = []) => {
	return [...items].sort((a, b) => {
		const aUnit = Number(a?.u_start);
		const bUnit = Number(b?.u_start);
		const aValid = Number.isFinite(aUnit);
		const bValid = Number.isFinite(bUnit);

		if (aValid && bValid) return aUnit - bUnit;
		if (aValid) return -1;
		if (bValid) return 1;
		return 0;
	});
};

function ModelDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [model, setModel] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingDevice, setIsEditingDevice] = useState(false);
	const [editingDevice, setEditingDevice] = useState(null);

	const loadModel = async () => {
		setIsLoading(true);
		const data = await fetchJson(`/api/models/${id}`, null);
		setModel(data);
		setIsLoading(false);
	};

	useEffect(() => {
		loadModel();
	}, [id]);

	const handleSaveModel = async () => {
		setIsEditing(false);
		await loadModel();
	};

	const handleEditDevice = (device) => {
		setEditingDevice(device);
		setIsEditingDevice(true);
	};

	const handleSaveDevice = async () => {
		setIsEditingDevice(false);
		setEditingDevice(null);
		await loadModel();
	};

	if (isLoading) {
		return (
			<div className="catalog-page">
				<Sidebar theme="light" mode="drawer" />
				<main className="catalog-page__main">
					<section className="catalog-page__content">
						<div className="catalog-page__empty">Cargando modelo...</div>
					</section>
				</main>
			</div>
		);
	}

	if (!model) {
		return (
			<div className="catalog-page">
				<Sidebar theme="light" mode="drawer" />
				<main className="catalog-page__main">
					<section className="catalog-page__content">
						<div className="catalog-page__empty">No encontramos ese modelo.</div>
						<button type="button" className="catalog-page__back" onClick={() => navigate("/models")}>Volver a modelos</button>
					</section>
				</main>
			</div>
		);
	}

	if (isEditing) {
		return (
			<div className="catalog-page">
				<Sidebar theme="light" mode="drawer" />
				<main className="catalog-page__main">
					<section className="catalog-page__content">
						<ModelEditForm
							model={model}
							onSave={handleSaveModel}
							onCancel={() => setIsEditing(false)}
						/>
					</section>
				</main>
			</div>
		);
	}

	const vendorName = model.vendor_name || "Sin fabricante";
	const devicesCount = model.devices_count || 0;
	const sortedDevices = sortDevicesByUnit(model.devices || []);

	return (
		<div className="catalog-page">
			<Sidebar theme="light" mode="drawer" />

			<main className="catalog-page__main">
				<section className="catalog-page__content">
					<header className="catalog-page__header">
						<div>
							<button type="button" className="catalog-page__back" onClick={() => navigate("/models")}>← Volver</button>
							<p className="catalog-page__eyebrow">Detalle de modelo</p>
							<h1 className="catalog-page__title">{model.model_name}</h1>
							<p className="catalog-page__subtitle">{vendorName}</p>
						</div>

						<div className="catalog-page__actions">
							<button type="button" onClick={() => setIsEditing(true)} className="catalog-page__link-button">Editar modelo</button>
							<Link to="/vendors" className="catalog-page__link-button">Ver fabricante</Link>
						</div>
					</header>

					<div className="catalog-page__stats">
						<div className="catalog-stat-card">
							<p className="catalog-stat-card__label">Tipo</p>
							<p className="catalog-stat-card__value">{model.device_type}</p>
						</div>
						<div className="catalog-stat-card">
							<p className="catalog-stat-card__label">Altura</p>
							<p className="catalog-stat-card__value">{model.u_height}U</p>
						</div>
						<div className="catalog-stat-card">
							<p className="catalog-stat-card__label">Equipos</p>
							<p className="catalog-stat-card__value">{devicesCount}</p>
						</div>
					</div>

					<div className="catalog-panel">
						<h2 className="catalog-panel__title">Equipos que usan este modelo</h2>
						{devicesCount === 0 ? (
							<div className="catalog-page__empty">Todavía no hay equipos asociados.</div>
						) : (
							<div className="catalog-table-wrap">
								<table className="catalog-table">
									<thead>
										<tr>
											<th>Equipo</th>
											<th>Serial / Asset</th>
											<th>Ubicación</th>
											<th>U</th>
											<th style={{ textAlign: "right" }}>Acciones</th>
										</tr>
									</thead>
									<tbody>
										{sortedDevices.map((device) => (
											<tr key={device.device_id}>
												<td>
													<div className="catalog-table__primary">
														<strong>{device.name}</strong>
														<span>{device.status === 'active' ? 'Activo' : device.status === 'maintenance' ? 'Mantenimiento' : 'Retirado'}</span>
													</div>
												</td>
												<td>
													<div className="catalog-table__secondary">
														<span>{device.serial_number || 'Sin serial'}</span>
														<span>{device.asset_tag || 'Sin asset'}</span>
													</div>
												</td>
												<td>
													<div className="catalog-table__secondary">
														<span>{device.site_name || 'Sin sitio'}</span>
														<span>{device.room_name || 'Sin sala'} · {device.rack_code || 'Sin rack'}</span>
													</div>
												</td>
												<td>U {device.u_start ?? 'N/D'}</td>
												<td>
													<div className="catalog-table__actions">
														<button
															type="button"
															className="catalog-mini-item__button"
															onClick={() => handleEditDevice(device)}
														>
															Editar equipo
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{isEditingDevice && editingDevice ? (
						<div className="modal-overlay" onClick={() => setIsEditingDevice(false)}>
							<div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
								<DeviceEditForm
									device={editingDevice}
									isCreating={false}
									onSave={handleSaveDevice}
									onCancel={() => {
										setIsEditingDevice(false);
										setEditingDevice(null);
									}}
								/>
							</div>
						</div>
					) : null}
				</section>
			</main>
		</div>
	);
}

export default ModelDetail;