import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { fetchJson } from "../../lib/dcimApi";
import ModelEditForm from "./ModelEditForm";
import "./ModelsList.css";

function ModelDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [model, setModel] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

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
							<div className="catalog-mini-list">
								{model.devices.map((device) => (
									<div key={device.device_id} className="catalog-mini-item">
										<div>
											<strong>{device.name}</strong>
											<span>{device.serial_number || 'Sin serial'} · {device.asset_tag || 'Sin asset'}</span>
										</div>
										<div>
											<span>{device.site_name} · {device.room_name} · {device.rack_code}</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}

export default ModelDetail;