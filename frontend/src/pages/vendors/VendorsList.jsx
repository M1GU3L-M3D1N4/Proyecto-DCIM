import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import mockData from "../../data/mockData.json";
import { fetchJson } from "../../lib/dcimApi";
import "./VendorsList.css";

function VendorsList() {
  const fallbackVendors = (mockData.vendors || []).map((vendor) => {
    const vendorModels = (mockData.device_models || []).filter((model) => String(model.vendor_id) === String(vendor.vendor_id));
    const vendorDeviceIds = new Set(vendorModels.flatMap((model) => (mockData.devices || []).filter((device) => String(device.model_id) === String(model.model_id)).map((device) => device.device_id)));

    return {
      ...vendor,
      models_count: vendorModels.length,
      devices_count: vendorDeviceIds.size,
    };
  });
  const [vendors, setVendors] = useState(fallbackVendors);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchJson("/api/vendors", fallbackVendors);
        setVendors(Array.isArray(data) ? data : fallbackVendors);
      } catch (loadError) {
        setVendors(fallbackVendors);
        setError(loadError.message || "No se pudieron cargar los fabricantes");
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, []);

  const totalModels = (mockData.device_models || []).length;
  const totalDevices = (mockData.devices || []).length;

  return (
    <div className="catalog-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="catalog-page__main">
        <section className="catalog-page__content">
          <header className="catalog-page__header">
            <div>
              <p className="catalog-page__eyebrow">Catálogo</p>
              <h1 className="catalog-page__title">Fabricantes</h1>
              <p className="catalog-page__subtitle">Base de marcas asociadas a los modelos del inventario</p>
            </div>
            <div className="catalog-page__actions">
              <Link to="/models" className="catalog-page__link-button">Ver modelos</Link>
            </div>
          </header>

          {error ? <div className="catalog-page__empty">{error}. Se muestran datos de ejemplo.</div> : null}
          {isLoading ? <div className="catalog-page__empty">Cargando fabricantes...</div> : null}

          <div className="catalog-page__stats">
            <div className="catalog-stat-card">
              <p className="catalog-stat-card__label">Fabricantes</p>
              <p className="catalog-stat-card__value">{vendors.length}</p>
            </div>
            <div className="catalog-stat-card">
              <p className="catalog-stat-card__label">Modelos</p>
              <p className="catalog-stat-card__value">{totalModels}</p>
            </div>
            <div className="catalog-stat-card">
              <p className="catalog-stat-card__label">Equipos</p>
              <p className="catalog-stat-card__value">{totalDevices}</p>
            </div>
          </div>

          <div className="catalog-grid">
            {vendors.map((vendor) => (
              <article key={vendor.vendor_id} className="catalog-card">
                <div>
                  <p className="catalog-card__eyebrow">Fabricante</p>
                  <h2 className="catalog-card__title">{vendor.name}</h2>
                  <p className="catalog-card__meta">{vendor.support_url || "Sin URL de soporte"}</p>
                </div>

                <div className="catalog-card__metrics">
                  <span>{vendor.models_count} modelos</span>
                  <span>{vendor.devices_count} equipos</span>
                </div>

                <div className="catalog-card__actions">
                  <Link to={`/vendors/${vendor.vendor_id}`} className="catalog-card__button">Ver detalle</Link>
                  <Link to="/models" className="catalog-card__button catalog-card__button--ghost">Ver modelos</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default VendorsList;