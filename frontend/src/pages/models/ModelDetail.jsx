import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import mockData from "../../data/mockData.json";
import { fetchJson } from "../../lib/dcimApi";
import "./ModelsList.css";

function ModelDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const fallbackModel = (mockData.device_models || []).find((item) => String(item.model_id) === String(id));
	const [model, setModel] = useState(fallbackModel || null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadModel = async () => {
			setIsLoading(true);
			const data = await fetchJson(`/api/models/${id}`, fallbackModel || null);
			setModel(data);
			setIsLoading(false);
		};

		loadModel();
	}, [id]);

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

	const vendor = (mockData.vendors || []).find((item) => String(item.vendor_id) === String(model.vendor_id));
	const devices = (mockData.devices || []).filter((device) => String(device.model_id) === String(model.model_id));

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
							<p className="catalog-page__subtitle">{vendor?.name ?? "Sin fabricante"}</p>
						</div>

						<div className="catalog-page__actions">
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
							<p className="catalog-stat-card__value">{devices.length}</p>
						</div>
					</div>

					<div className="catalog-panel">
						<h2 className="catalog-panel__title">Equipos que usan este modelo</h2>
						{devices.length === 0 ? (
							<div className="catalog-page__empty">Todavía no hay equipos asociados.</div>
						) : (
							<div className="catalog-mini-list">
								{devices.map((device) => (
									<div key={device.device_id} className="catalog-mini-item">
										<strong>{device.hostname}</strong>
										<span>{device.asset_tag}</span>
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