import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { deleteJson, fetchJson, postJson, putJson } from "../../lib/dcimApi";
import VendorEditForm from "./VendorEditForm";
import "./VendorsList.css";

/**
 * Pantalla de listado de fabricantes (vendors).
 * Muestra un resumen de cada fabricante, incluyendo su nombre, URL de soporte, cantidad de modelos y equipos asociados.
 * Permite crear, editar y eliminar fabricantes utilizando prompts para ingresar la información requerida.
 * Se usaron las funciones `fetchJson`, `postJson`, `putJson` y `deleteJson` para interactuar con la API del backend y manejar las operaciones CRUD de los fabricantes.
 * La url de esta pantalla es `/vendors`.
 * El componente utiliza el hook `useEffect` para cargar la lista de fabricantes al montarse, y el estado local para manejar la información de los fabricantes, el estado de carga y los errores.
 */
function VendorsList() {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const loadVendors = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchJson("/api/vendors", []);
      setVendors(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "No se pudieron cargar los fabricantes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setEditingVendor({ name: "", support_url: "" });
    setIsEditing(true);
  };

  const handleEdit = async (vendor) => {
    setEditingVendor(vendor);
    setIsEditing(true);
  };

  const handleSaveVendor = async () => {
    setIsEditing(false);
    await loadVendors();
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`¿Eliminar el fabricante ${vendor.name}?`)) return;
    await deleteJson(`/api/vendors/${vendor.vendor_id}`);
    await loadVendors();
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const totalModels = vendors.reduce((sum, vendor) => sum + (vendor.models_count || 0), 0);
  const totalDevices = vendors.reduce((sum, vendor) => sum + (vendor.devices_count || 0), 0);

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
              <button type="button" className="catalog-page__link-button" onClick={handleCreate}>Nuevo fabricante</button>
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
                  <button type="button" className="catalog-card__button" onClick={() => handleEdit(vendor)}>Editar</button>
                  <button type="button" className="catalog-card__button catalog-card__button--ghost" onClick={() => handleDelete(vendor)}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>

          {isEditing && editingVendor && (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <VendorEditForm
                  vendor={editingVendor}
                  onSave={handleSaveVendor}
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

export default VendorsList;