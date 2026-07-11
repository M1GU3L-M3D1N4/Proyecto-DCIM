import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { buildQueryString, deleteJson, fetchJson, postJson, putJson } from "../../lib/dcimApi";
import RoomEditForm from "./RoomEditForm";
import "./RoomsList.css";

function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("site_id");

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchJson(`/api/rooms${buildQueryString({ site_id: siteId })}`, []);
      setRooms(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "No se pudieron cargar las salas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setEditingRoom({ site_id: siteId || "", name: "", floor: "" });
    setIsEditing(true);
  };

  const handleEdit = async (room) => {
    setEditingRoom(room);
    setIsEditing(true);
  };

  const handleSaveRoom = async () => {
    setIsEditing(false);
    await loadRooms();
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`¿Eliminar la sala ${room.name}?`)) return;
    await deleteJson(`/api/rooms/${room.room_id}`);
    await loadRooms();
  };

  useEffect(() => {
    loadRooms();
  }, [siteId]);

  const totalRacks = rooms.reduce((sum, room) => sum + (room.racks_count || 0), 0);
  const occupiedRacks = rooms.reduce((sum, room) => sum + (room.occupied_racks || 0), 0);
  const availableRacks = Math.max(totalRacks - occupiedRacks, 0);

  return (
    <div className="rooms-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="rooms-page__main">
        <section className="rooms-page__content">
          <header className="rooms-page__header">
            <div>
              <p className="rooms-page__eyebrow">Salas</p>
              <h1 className="rooms-page__title">Salas</h1>
              <p className="rooms-page__subtitle">Organiza los espacios físicos de cada sitio</p>
            </div>

            <div className="rooms-page__actions">
              <button type="button" className="rooms-page__create" onClick={handleCreate}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Nueva Sala
              </button>
              <Link to="/racks" className="rooms-page__create">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Ver Racks
              </Link>
            </div>
          </header>

          {siteId ? <div className="rooms-page__note">Filtrando por sitio #{siteId}.</div> : null}

          <div className="rooms-page__stats">
            <div className="rooms-stat-card">
              <p className="rooms-stat-card__label">Salas</p>
              <p className="rooms-stat-card__value">{rooms.length}</p>
            </div>
            <div className="rooms-stat-card">
              <p className="rooms-stat-card__label">Racks totales</p>
              <p className="rooms-stat-card__value">{totalRacks}</p>
            </div>
            <div className="rooms-stat-card">
              <p className="rooms-stat-card__label">Racks ocupados</p>
              <p className="rooms-stat-card__value">{occupiedRacks}</p>
            </div>
            <div className="rooms-stat-card">
              <p className="rooms-stat-card__label">Disponibles</p>
              <p className="rooms-stat-card__value">{availableRacks}</p>
            </div>
          </div>

          <div className="rooms-page__card">
            {error ? <div className="rooms-page__note">{error}. Se muestran datos de ejemplo.</div> : null}
            {isLoading ? (
              <div className="rooms-page__empty">Cargando salas...</div>
            ) : rooms.length === 0 ? (
              <div className="rooms-page__empty">Todavía no hay salas para mostrar.</div>
            ) : (
              <div className="rooms-grid">
                {rooms.map((room) => {
                  const occupancy = room.racks_count ? Math.round((room.occupied_racks / room.racks_count) * 100) : 0;

                  return (
                    <article key={room.room_id} className="room-card">
                      <div className="room-card__top">
                        <div>
                          <p className="room-card__site">{room.site_name}</p>
                          <h2 className="room-card__title">{room.name}</h2>
                        </div>
                        <span className={`room-card__badge room-card__badge--${room.status === "Llena" ? "full" : room.status === "Disponible" ? "free" : "active"}`}>
                          {room.status}
                        </span>
                      </div>

                      <p className="room-card__meta">{room.floor}</p>

                      <div className="room-card__metrics">
                        <div>
                          <span className="room-card__metric-label">Racks</span>
                          <strong>{room.racks_count}</strong>
                        </div>
                        <div>
                          <span className="room-card__metric-label">Ocupados</span>
                          <strong>{room.occupied_racks}</strong>
                        </div>
                        <div>
                          <span className="room-card__metric-label">Uso</span>
                          <strong>{occupancy}%</strong>
                        </div>
                      </div>

                      <div className="room-card__bar" aria-hidden="true">
                        <span style={{ width: `${occupancy}%` }} />
                      </div>

                      <div className="room-card__actions">
                        <Link to={`/racks?room_id=${room.room_id}`} className="room-card__btn">Ver racks</Link>
                        <Link to={`/racks?room_id=${room.room_id}`} className="room-card__icon-btn" aria-label={`Gestionar racks de ${room.name}`}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3l-.5-.5a2.1 2.1 0 0 0-3 0L4 16v4Z" />
                            <path d="M13.5 6.5 17.5 10.5" />
                          </svg>
                        </Link>
                        <button type="button" className="room-card__btn" onClick={() => handleEdit(room)}>Editar</button>
                        <button type="button" className="room-card__btn" onClick={() => handleDelete(room)}>Eliminar</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {isEditing && editingRoom && (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <RoomEditForm
                  room={editingRoom}
                  siteId={siteId}
                  onSave={handleSaveRoom}
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

export default RoomsList;