import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { fetchJson } from "../../lib/dcimApi";
import RackEditForm from "./RackEditForm";
import "./RackDetail.css";

function RackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rack, setRack] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadRack = async () => {
    setIsLoading(true);
    const data = await fetchJson(`/api/racks/${id}`, null);
    setRack(data);
    const apiDevices = await fetchJson(`/api/devices?rack_id=${id}`, []);
    setDevices(Array.isArray(apiDevices) ? apiDevices : []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRack();
  }, [id]);

  const handleSaveRack = async () => {
    setIsEditing(false);
    await loadRack();
  };

  if (isLoading) {
    return (
      <div className="rack-detail-page">
        <Sidebar theme="light" mode="drawer" />
        <main className="rack-detail-page__main">
          <section className="rack-detail-page__content">
            <div className="rack-detail-page__empty">Cargando rack...</div>
          </section>
        </main>
      </div>
    );
  }

  if (!rack) {
    return (
      <div className="rack-detail-page">
        <Sidebar theme="light" mode="drawer" />
        <main className="rack-detail-page__main">
          <section className="rack-detail-page__content">
            <div className="rack-detail-page__empty">No encontramos ese rack.</div>
            <button type="button" className="rack-detail-page__back" onClick={() => navigate("/racks")}>Volver a racks</button>
          </section>
        </main>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="rack-detail-page">
        <Sidebar theme="light" mode="drawer" />
        <main className="rack-detail-page__main">
          <section className="rack-detail-page__content">
            <RackEditForm
              rack={rack}
              onSave={handleSaveRack}
              onCancel={() => setIsEditing(false)}
            />
          </section>
        </main>
      </div>
    );
  }

  const usedUnits = rack.used_units ?? 7;
  const occupancy = rack.used_percent ?? 0;
  const siteName = rack.site_name ?? "Sin sitio";
  const roomName = rack.room_name ?? "Sin sala";
  const roomFloor = rack.floor ?? rack.room_floor ?? "N/D";

  return (
    <div className="rack-detail-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="rack-detail-page__main">
        <section className="rack-detail-page__content">
          <header className="rack-detail-page__header">
            <div>
              <button type="button" className="rack-detail-page__back" onClick={() => navigate("/racks")}>← Volver</button>
              <p className="rack-detail-page__eyebrow">Detalle de rack</p>
              <h1 className="rack-detail-page__title">{rack.code}</h1>
              <p className="rack-detail-page__subtitle">{siteName} · {roomName}</p>
            </div>

            <div className="rack-detail-page__actions">
                    <button type="button" onClick={() => setIsEditing(true)} className="rack-detail-page__primary">Editar rack</button>
              <Link to="/devices" className="rack-detail-page__secondary">Ver equipos</Link>
            </div>
          </header>

          <div className="rack-detail-page__summary">
            <div className="rack-detail-card">
              <p className="rack-detail-card__label">Capacidad</p>
              <p className="rack-detail-card__value">{rack.total_u}U</p>
            </div>
            <div className="rack-detail-card">
              <p className="rack-detail-card__label">Unidades ocupadas</p>
              <p className="rack-detail-card__value">{usedUnits}</p>
            </div>
            <div className="rack-detail-card">
              <p className="rack-detail-card__label">Uso</p>
              <p className="rack-detail-card__value">{occupancy}%</p>
            </div>
            <div className="rack-detail-card">
              <p className="rack-detail-card__label">Dispositivos</p>
              <p className="rack-detail-card__value">{devices.length}</p>
            </div>
          </div>

          <div className="rack-detail-page__grid">
            <article className="rack-detail-panel">
              <div className="rack-detail-panel__header">
                <h2>Información general</h2>
              </div>
              <div className="rack-detail-panel__body">
                <p><strong>Sitio:</strong> {siteName}</p>
                <p><strong>Sala:</strong> {roomName}</p>
                <p><strong>Piso:</strong> {roomFloor}</p>
                <p><strong>Identificador:</strong> {rack.rack_id}</p>
              </div>
            </article>

            <article className="rack-detail-panel">
              <div className="rack-detail-panel__header">
                <h2>Ocupación</h2>
              </div>
              <div className="rack-detail-panel__body">
                <div className="rack-detail-progress" aria-hidden="true">
                  <span style={{ width: `${occupancy}%` }} />
                </div>
                <p className="rack-detail-panel__note">{usedUnits} de {rack.total_u}U ocupadas</p>
              </div>
            </article>
          </div>

          <article className="rack-detail-panel rack-detail-panel--full">
            <div className="rack-detail-panel__header">
              <h2>Equipos instalados</h2>
            </div>
            <div className="rack-detail-table-wrap">
              {devices.length === 0 ? (
                <div className="rack-detail-page__empty">Este rack todavía no tiene equipos instalados.</div>
              ) : (
                <table className="rack-detail-table">
                  <thead>
                    <tr>
                      <th>Equipo</th>
                      <th>Modelo</th>
                      <th>Posición</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => (
                      <tr key={device.device_id}>
                        <td>{device.name}</td>
                        <td>{device.model?.model_name ?? device.model_name ?? "Sin modelo"}</td>
                        <td>U {device.u_start ?? "N/D"}</td>
                        <td>{device.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default RackDetail;