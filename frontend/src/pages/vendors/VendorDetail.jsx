import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { fetchJson } from "../../lib/dcimApi";
import VendorEditForm from "./VendorEditForm";
import "./VendorsList.css";

/**
 * Pantalla de detalle de un fabricante (vendor).
 * Muestra información del fabricante, estadísticas de modelos y equipos asociados, y una lista de los modelos relacionados.
 * Cada cpnstante se obtiene a través de la API utilizando el ID del fabricante pasado en la URL.
 * La url de esta pantalla es `/vendors/:id`, donde `:id` es el identificador del fabricante a mostrar.
 * Si el fabricante no existe, se muestra un mensaje de error y un botón para volver al listado de fabricantes.
 * Si el fabricante existe, se muestra su nombre, URL de soporte, estadísticas de modelos y equipos, y una lista de los modelos asociados.
 * El componente utiliza el hook `useEffect` para cargar los datos del fabricante al montarse, y el estado local para manejar la información del fabricante y el estado de carga.
 */

function VendorDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [vendor, setVendor] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

	const loadVendor = async () => {
		setIsLoading(true);
		const data = await fetchJson(`/api/vendors/${id}`, null);
		setVendor(data);
		setIsLoading(false);
	};

	useEffect(() => {
		loadVendor();
	}, [id]);

	const handleSaveVendor = async () => {
		setIsEditing(false);
		await loadVendor();
	};

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

	if (isEditing) {
		return (
			<div className="catalog-page">
				<Sidebar theme="light" mode="drawer" />
				<main className="catalog-page__main">
					<section className="catalog-page__content">
						<VendorEditForm
							vendor={vendor}
							onSave={handleSaveVendor}
							onCancel={() => setIsEditing(false)}
						/>
					</section>
				</main>
			</div>
		);
	}

	const models = vendor.models || [];
	const deviceCount = vendor.devices_count || 0;

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
							<button type="button" onClick={() => setIsEditing(true)} className="catalog-page__link-button">Editar fabricante</button>
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
/** Pantalla de detalle de un fabricante (vendor). Muestra información del fabricante, estadísticas de modelos y equipos asociados, y una lista de los modelos relacionados. Cada cpnstante se obtiene a través de la API utilizando el ID del fabricante pasado en la URL. La url de esta pantalla es `/vendors/:id`, donde `:id` es el identificador del fabricante a mostrar. Si el fabricante no existe, se muestra un mensaje de error y un botón para volver al listado de fabricantes. Si el fabricante existe, se muestra su nombre, URL de soporte, estadísticas de modelos y equipos, y una lista de los modelos asociados. El componente utiliza el hook `useEffect` para cargar los datos del fabricante al montarse, y el estado local para manejar la información del fabricante y el estado de carga.
 * Esta enorme función se encarga de mostrar toda la información relevante de un fabricante específico, incluyendo sus modelos y la cantidad de equipos asociados. Maneja tanto el estado de carga como el caso en que el fabricante no exista, proporcionando una experiencia de usuario completa y robusta. */

export default VendorDetail;