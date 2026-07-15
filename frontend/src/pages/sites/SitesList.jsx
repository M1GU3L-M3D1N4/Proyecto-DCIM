import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Pagination from "../../components/Pagination";
import { deleteJson, fetchJson, postJson, putJson } from "../../lib/dcimApi";
import SiteEditForm from "./SiteEditForm";
import "./SitesList.css";

const ITEMS_PER_PAGE = 8;

function SitesList() {
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadSites = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchJson("/api/sites", []);
      setSites(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "No se pudieron cargar los sitios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setEditingSite({ name: "", city: "", address: "" });
    setIsEditing(true);
  };

  const handleEdit = async (site) => {
    setEditingSite(site);
    setIsEditing(true);
  };

  const handleSaveSite = async () => {
    setIsEditing(false);
    await loadSites();
  };

  const handleDelete = async (site) => {
    if (!window.confirm(`¿Eliminar el sitio ${site.name}?`)) return;
    await deleteJson(`/api/sites/${site.site_id}`);
    await loadSites();
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [sites.length]);

  const totalPages = Math.max(1, Math.ceil(sites.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSites = sites.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <div className="sites-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="sites-page__main">
        <section className="sites-page__content">
          <header className="sites-page__header">
            <div>
              <p className="sites-page__eyebrow">Sitios</p>
              <h1 className="sites-page__title">Sitios</h1>
              <p className="sites-page__subtitle">Gestión de centros de datos</p>
            </div>

            <div className="sites-page__actions">
              <button type="button" className="sites-page__create" onClick={handleCreate}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Nuevo Sitio
              </button>
              <Link to="/rooms" className="sites-page__create">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Ver Salas
              </Link>
            </div>
          </header>

          <div className="sites-page__card">
            {error ? (
              <div className="sites-page__empty">{error}</div>
            ) : isLoading ? (
              <div className="sites-page__empty">Cargando sitios...</div>
            ) : sites.length === 0 ? (
              <div className="sites-page__empty">Todavía no hay sitios para mostrar.</div>
            ) : (
              <table className="sites-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Ciudad</th>
                    <th>Dirección</th>
                    <th>Salas</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSites.map((site) => (
                    <tr key={site.site_id}>
                      <td className="sites-table__name">{site.name}</td>
                      <td>{site.city}</td>
                      <td>{site.address}</td>
                      <td className="sites-table__rooms">{site.rooms_count ?? 0} salas</td>
                      <td>
                        <div className="sites-table__actions">
                          <Link type="button" className="sites-table__btn" to={`/rooms?site_id=${site.site_id}`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Ver Salas
                          </Link>
                          <Link className="sites-table__icon-btn" aria-label={`Gestionar salas de ${site.name}`} to={`/rooms?site_id=${site.site_id}`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3l-.5-.5a2.1 2.1 0 0 0-3 0L4 16v4Z" />
                              <path d="M13.5 6.5 17.5 10.5" />
                            </svg>
                          </Link>
                          <button type="button" className="sites-table__btn" onClick={() => handleEdit(site)}>
                            Editar
                          </button>
                          <button type="button" className="sites-table__btn" onClick={() => handleDelete(site)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <Pagination
              totalItems={sites.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={safePage}
              onPageChange={setCurrentPage}
            />
          </div>

          {isEditing && editingSite && (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <SiteEditForm
                  site={editingSite}
                  onSave={handleSaveSite}
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

export default SitesList;