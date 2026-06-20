import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { deleteJson, fetchJson, postJson, putJson } from "../../lib/dcimApi";
import "./ModelsList.css";

function ModelsList() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadModels = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchJson("/api/models", []);
      setModels(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "No se pudieron cargar los modelos");
    } finally {
      setIsLoading(false);
    }
  };

  const promptModel = (model = {}) => {
    const vendorId = window.prompt("ID del fabricante", model.vendor_id || "");
    if (vendorId === null) return null;
    const modelName = window.prompt("Nombre del modelo", model.model_name || "");
    if (modelName === null) return null;
    const deviceType = window.prompt("Tipo de dispositivo (server, switch, router, firewall, storage, ups, pdu, other)", model.device_type || "other");
    if (deviceType === null) return null;
    const height = window.prompt("Altura U", model.u_height || "1");
    if (height === null) return null;
    return { vendor_id: Number(vendorId), model_name: modelName.trim(), device_type: deviceType.trim(), u_height: Number(height) };
  };

  const handleCreate = async () => {
    const payload = promptModel();
    if (!payload) return;
    await postJson("/api/models", payload);
    await loadModels();
  };

  const handleEdit = async (model) => {
    const payload = promptModel(model);
    if (!payload) return;
    await putJson(`/api/models/${model.model_id}`, payload);
    await loadModels();
  };

  const handleDelete = async (model) => {
    if (!window.confirm(`¿Eliminar el modelo ${model.model_name}?`)) return;
    await deleteJson(`/api/models/${model.model_id}`);
    await loadModels();
  };

  useEffect(() => {
    loadModels();
  }, []);

  const totalVendors = new Set(models.map((model) => model.vendor_id)).size;
  const totalDevices = models.reduce((sum, model) => sum + (model.devices_count || 0), 0);

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
              <button type="button" className="catalog-page__link-button" onClick={handleCreate}>Nuevo modelo</button>
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
                  <button type="button" className="catalog-card__button" onClick={() => handleEdit(model)}>Editar</button>
                  <button type="button" className="catalog-card__button catalog-card__button--ghost" onClick={() => handleDelete(model)}>Eliminar</button>
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