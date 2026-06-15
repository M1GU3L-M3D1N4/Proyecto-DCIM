import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import mockData from "../../data/mockData.json";
import { fetchJson } from "../../lib/dcimApi";
import "./VendorsList.css";

function VendorDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const fallbackVendor = (mockData.vendors || []).find((item) => String(item.vendor_id) === String(id));
	const [vendor, setVendor] = useState(fallbackVendor || null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadVendor = async () => {
			setIsLoading(true);
			const data = await fetchJson(`/api/vendors/${id}`, fallbackVendor || null);
			setVendor(data);
			setIsLoading(false);
		};

		loadVendor();
	}, [id]);

	if (isLoading) {
		return (
			<div className="catalog-page">
				<Sidebar theme="light" mode="drawer" />
				<main className="catalog-page__main">
					<section className="catalog-page__content">
						<div className="catalog-page__empty">Cargando fabricante...</div>
					</section>
				</main>
			</div>
		);
	}

	if (!vendor) {
		return (
			<div className="catalog-page">
				<Sidebar theme="light" mode="drawer" />
				<main className="catalog-page__main">
					<section className="catalog-page__content">
						<div className="catalog-page__empty">No encontramos ese fabricante.</div>
						<button type="button" className="catalog-page__back" onClick={() => navigate("/vendors")}>Volver a fabricantes</button>
					</section>
				</main>
			</div>
		);
	}

	const models = (mockData.device_models || []).filter((model) => String(model.vendor_id) === String(vendor.vendor_id));
	const deviceCount = (mockData.devices || []).filter((device) => models.some((model) => String(model.model_id) === String(device.model_id))).length;

	return (
		<div className="catalog-page">
			<Sidebar theme="light" mode="drawer" />

			<main className="catalog-page__main">
				<section className="catalog-page__content">
					<header className="catalog-page__header">
						<div>
							<button type="button" className="catalog-page__back" onClick={() => navigate("/vendors")}>← Volver</button>
							<p className="catalog-page__eyebrow">Detalle de fabricante</p>
							<h1 className="catalog-page__title">{vendor.name}</h1>
							<p className="catalog-page__subtitle">{vendor.support_url || "Sin URL de soporte"}</p>
						</div>

						<div className="catalog-page__actions">
							<Link to="/models" className="catalog-page__link-button">Ver modelos</Link>
						</div>
					</header>

					<div className="catalog-page__stats">
						<div className="catalog-stat-card">
							<p className="catalog-stat-card__label">Modelos</p>
							<p className="catalog-stat-card__value">{models.length}</p>
						</div>
						<div className="catalog-stat-card">
							<p className="catalog-stat-card__label">Equipos</p>
							<p className="catalog-stat-card__value">{deviceCount}</p>
						</div>
					</div>

					<div className="catalog-panel">
						<h2 className="catalog-panel__title">Modelos asociados</h2>
						{models.length === 0 ? (
							<div className="catalog-page__empty">Este fabricante todavía no tiene modelos.</div>
						) : (
							<div className="catalog-mini-list">
								{models.map((model) => (
									<div key={model.model_id} className="catalog-mini-item">
										<strong>{model.model_name}</strong>
										<span>{model.device_type} · {model.u_height}U</span>
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

export default VendorDetail;