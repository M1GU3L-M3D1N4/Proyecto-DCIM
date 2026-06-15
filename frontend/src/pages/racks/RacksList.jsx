import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import mockData from "../../data/mockData.json";
import { buildQueryString, fetchJson } from "../../lib/dcimApi";
import "./RacksList.css";

const sitesById = new Map((mockData.sites || []).map((site) => [site.site_id, site]));
const roomsById = new Map((mockData.rooms || []).map((room) => [room.room_id, room]));
const modelsById = new Map((mockData.device_models || []).map((model) => [model.model_id, model]));

const devicesByRack = (rackId) =>
  (mockData.devices || []).filter((device) => String(device.rack_id) === String(rackId));

const occupancyByRack = (rackId) =>
  (mockData.rack_unit_occupancy || []).filter((unit) => String(unit.rack_id) === String(rackId));

const getRackCapacity = (rack) => {
  const occupancy = occupancyByRack(rack.rack_id);
  if (occupancy.length === 0) {
    return { usedUnits: 0, usedPercent: 0 };
  }

  const usedUnits = occupancy.length;
  const usedPercent = Math.min(Math.round((usedUnits / rack.total_u) * 100), 100);
  return { usedUnits, usedPercent };
};

function RacksList() {
  const [racks, setRacks] = useState(() => (mockData.racks || []).map((rack) => {
    const room = roomsById.get(rack.room_id);
    const site = room ? sitesById.get(room.site_id) : null;
    const devices = devicesByRack(rack.rack_id);
    const occupancy = getRackCapacity(rack);

    return {
      ...rack,
      room_name: room?.name ?? "Sin sala",
      site_name: site?.name ?? "Sin sitio",
      device_count: devices.length,
      used_units: occupancy.usedUnits,
      used_percent: occupancy.usedPercent,
    };
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room_id");

  useEffect(() => {
    const loadRacks = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchJson(`/api/racks${buildQueryString({ room_id: roomId })}`, racks);
        setRacks(Array.isArray(data) ? data : racks);
      } catch (loadError) {
        setRacks(racks);
        setError(loadError.message || "No se pudieron cargar los racks");
      } finally {
        setIsLoading(false);
      }
    };

    loadRacks();
  }, [roomId]);

  const totalRacks = racks.length;
  const totalU = racks.reduce((sum, rack) => sum + (rack.total_u || 0), 0);
  const usedUnits = racks.reduce((sum, rack) => sum + (rack.used_units || 0), 0);
  const availableUnits = Math.max(totalU - usedUnits, 0);

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
            </div>

            <div className="racks-page__actions">
              <Link to="/devices" className="racks-page__create">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Ver Equipos
              </Link>
            </div>
          </header>

          {roomId ? <div className="racks-page__note">Filtrando por sala #{roomId}.</div> : null}

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
                {racks.map((rack) => (
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
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default RacksList;