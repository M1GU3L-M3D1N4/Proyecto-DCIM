import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Pagination from "../../components/Pagination";
import { deleteJson, fetchJson, postJson, putJson } from "../../lib/dcimApi";
import ModelEditForm from "./ModelEditForm";
import "./ModelsList.css";

const ITEMS_PER_PAGE = 8;

function ModelsList() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleCreate = async () => {
    setEditingModel({ vendor_id: "", model_name: "", device_type: "other", u_height: "1" });
    setIsEditing(true);
  };

  const handleEdit = async (model) => {
    setEditingModel(model);
    setIsEditing(true);
  };

  const handleSaveModel = async () => {
    setIsEditing(false);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [models.length]);

  const totalVendors = new Set(models.map((model) => model.vendor_id)).size;
  const totalDevices = models.reduce((sum, model) => sum + (model.devices_count || 0), 0);
  const totalPages = Math.max(1, Math.ceil(models.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedModels = models.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

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
            {paginatedModels.map((model) => (
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

          <Pagination
            totalItems={models.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={safePage}
            onPageChange={setCurrentPage}
          />

          {isEditing && editingModel && (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <ModelEditForm
                  model={editingModel}
                  onSave={handleSaveModel}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ModelsList;