import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Pagination from "../../components/Pagination";
import { buildQueryString, deleteJson, fetchJson, postJson, putJson } from "../../lib/dcimApi";
import RackEditForm from "./RackEditForm";
import "./RacksList.css";

const ITEMS_PER_PAGE = 8;

function RacksList() {
  const [racks, setRacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRack, setEditingRack] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room_id");
  const roomNameParam = searchParams.get("room_name");

  const loadRacks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchJson(`/api/racks${buildQueryString({ room_id: roomId })}`, []);
      setRacks(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "No se pudieron cargar los racks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setEditingRack({ room_id: roomId || "", code: "", total_u: "42" });
    setIsEditing(true);
  };

  const handleEdit = async (rack) => {
    setEditingRack(rack);
    setIsEditing(true);
  };

  const handleSaveRack = async () => {
    setIsEditing(false);
    await loadRacks();
  };

  const handleDelete = async (rack) => {
    if (!window.confirm(`¿Eliminar el rack ${rack.code}?`)) return;
    await deleteJson(`/api/racks/${rack.rack_id}`);
    await loadRacks();
  };

  useEffect(() => {
    loadRacks();
  }, [roomId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roomId, racks.length]);

  const totalRacks = racks.length;
  const totalU = racks.reduce((sum, rack) => sum + (rack.total_u || 0), 0);
  const usedUnits = racks.reduce((sum, rack) => sum + (rack.used_units || 0), 0);
  const availableUnits = Math.max(totalU - usedUnits, 0);
  const roomName = roomNameParam || racks[0]?.room_name || "";
  const totalPages = Math.max(1, Math.ceil(racks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRacks = racks.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <div className="racks-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="racks-page__main">
        <section className="racks-page__content">
          <header className="racks-page__header">
            <div>
              <p className="racks-page__eyebrow">Racks</p>
              <h1 className="racks-page__title">Racks</h1>
              <p className="racks-page__subtitle">Gestiona la capacidad física y el inventario alojado</p>
              {roomName ? <p className="racks-page__room-name">{roomName}</p> : null}
            </div>

            <div className="racks-page__actions">
              <button type="button" className="racks-page__create" onClick={handleCreate}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Nuevo Rack
              </button>
              <Link to="/devices" className="racks-page__create">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Ver Equipos
              </Link>
            </div>
          </header>

          <div className="racks-page__stats">
            <div className="racks-stat-card">
              <p className="racks-stat-card__label">Racks</p>
              <p className="racks-stat-card__value">{totalRacks}</p>
            </div>
            <div className="racks-stat-card">
              <p className="racks-stat-card__label">Unidades totales</p>
              <p className="racks-stat-card__value">{totalU}</p>
            </div>
            <div className="racks-stat-card">
              <p className="racks-stat-card__label">Unidades ocupadas</p>
              <p className="racks-stat-card__value">{usedUnits}</p>
            </div>
            <div className="racks-stat-card">
              <p className="racks-stat-card__label">Disponibles</p>
              <p className="racks-stat-card__value">{availableUnits}</p>
            </div>
          </div>

          <div className="racks-page__card">
            {error ? <div className="racks-page__empty">{error}</div> : null}
            {isLoading ? (
              <div className="racks-page__empty">Cargando racks...</div>
            ) : racks.length === 0 ? (
              <div className="racks-page__empty">Todavía no hay racks para mostrar.</div>
            ) : (
              <div className="racks-grid">
                {paginatedRacks.map((rack) => (
                  <article key={rack.rack_id} className="rack-card">
                    <div className="rack-card__top">
                      <div>
                        <p className="rack-card__site">{rack.site_name}</p>
                        <h2 className="rack-card__title">{rack.code}</h2>
                      </div>
                      <span className={`rack-card__badge ${rack.used_percent >= 100 ? "rack-card__badge--full" : rack.used_percent >= 70 ? "rack-card__badge--busy" : "rack-card__badge--free"}`}>
                        {rack.used_percent}% usado
                      </span>
                    </div>

                    <p className="rack-card__meta">{rack.room_name} · {rack.total_u}U</p>

                    <div className="rack-card__metrics">
                      <div>
                        <span className="rack-card__metric-label">Dispositivos</span>
                        <strong>{rack.device_count}</strong>
                      </div>
                      <div>
                        <span className="rack-card__metric-label">Ocupadas</span>
                        <strong>{rack.used_units}</strong>
                      </div>
                      <div>
                        <span className="rack-card__metric-label">Capacidad</span>
                        <strong>{rack.total_u}U</strong>
                      </div>
                    </div>

                    <div className="rack-card__bar" aria-hidden="true">
                      <span style={{ width: `${rack.used_percent}%` }} />
                    </div>

                    <div className="rack-card__actions">
                      <Link to={`/racks/${rack.rack_id}`} className="rack-card__btn">
                        Ver detalle
                      </Link>
                      <Link to={`/racks/${rack.rack_id}?mode=edit`} className="rack-card__icon-btn" aria-label={`Gestionar ${rack.code}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3l-.5-.5a2.1 2.1 0 0 0-3 0L4 16v4Z" />
                          <path d="M13.5 6.5 17.5 10.5" />
                        </svg>
                      </Link>
                      <button type="button" className="rack-card__btn" onClick={() => handleEdit(rack)}>Editar</button>
                      <button type="button" className="rack-card__btn" onClick={() => handleDelete(rack)}>Eliminar</button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Pagination
              totalItems={racks.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={safePage}
              onPageChange={setCurrentPage}
            />
          </div>

          {isEditing && editingRack && (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <RackEditForm
                  rack={editingRack}
                  onSave={handleSaveRack}
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

export default RacksList;