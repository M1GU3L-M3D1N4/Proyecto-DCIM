import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import mockData from "../../data/mockData.json";
import { fetchJson } from "../../lib/dcimApi";
import "./ModelsList.css";

const vendorsById = new Map((mockData.vendors || []).map((vendor) => [vendor.vendor_id, vendor]));

function ModelsList() {
  const fallbackModels = (mockData.device_models || []).map((model) => {
    const vendor = vendorsById.get(model.vendor_id);
    const devicesCount = (mockData.devices || []).filter((device) => String(device.model_id) === String(model.model_id)).length;

    return {
      ...model,
      vendor_name: vendor?.name ?? "Sin fabricante",
      devices_count: devicesCount,
    };
  });
  const [models, setModels] = useState(fallbackModels);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchJson("/api/models", fallbackModels);
        setModels(Array.isArray(data) ? data : fallbackModels);
      } catch (loadError) {
        setModels(fallbackModels);
        setError(loadError.message || "No se pudieron cargar los modelos");
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const totalVendors = (mockData.vendors || []).length;
  const totalDevices = (mockData.devices || []).length;

  return (
    <div className="catalog-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="catalog-page__main">
        <section className="catalog-page__content">
          <header className="catalog-page__header">
            <div>
              <p className="catalog-page__eyebrow">Catálogo</p>
              <h1 className="catalog-page__title">Modelos</h1>
              <p className="catalog-page__subtitle">Modelos disponibles para dispositivos y equipos instalados</p>
            </div>
            <div className="catalog-page__actions">
              <Link to="/vendors" className="catalog-page__link-button">Ver fabricantes</Link>
            </div>
          </header>

          {error ? <div className="catalog-page__empty">{error}. Se muestran datos de ejemplo.</div> : null}
          {isLoading ? <div className="catalog-page__empty">Cargando modelos...</div> : null}

          <div className="catalog-page__stats">
            <div className="catalog-stat-card">
              <p className="catalog-stat-card__label">Modelos</p>
              <p className="catalog-stat-card__value">{models.length}</p>
            </div>
            <div className="catalog-stat-card">
              <p className="catalog-stat-card__label">Fabricantes</p>
              <p className="catalog-stat-card__value">{totalVendors}</p>
            </div>
            <div className="catalog-stat-card">
              <p className="catalog-stat-card__label">Equipos</p>
              <p className="catalog-stat-card__value">{totalDevices}</p>
            </div>
          </div>

          <div className="catalog-grid">
            {models.map((model) => (
              <article key={model.model_id} className="catalog-card">
                <div>
                  <p className="catalog-card__eyebrow">Modelo</p>
                  <h2 className="catalog-card__title">{model.model_name}</h2>
                  <p className="catalog-card__meta">{model.vendor_name}</p>
                </div>

                <div className="catalog-card__metrics">
                  <span>{model.device_type}</span>
                  <span>{model.u_height}U</span>
                  <span>{model.devices_count} equipos</span>
                </div>

                <div className="catalog-card__actions">
                  <Link to={`/models/${model.model_id}`} className="catalog-card__button">Ver detalle</Link>
                  <Link to="/vendors" className="catalog-card__button catalog-card__button--ghost">Ver fabricante</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ModelsList;