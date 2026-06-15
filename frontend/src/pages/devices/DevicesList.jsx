import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import mockData from "../../data/mockData.json";
import { buildQueryString, fetchJson } from "../../lib/dcimApi";
import "./DevicesList.css";

const sitesById = new Map((mockData.sites || []).map((site) => [site.site_id, site]));
const roomsById = new Map((mockData.rooms || []).map((room) => [room.room_id, room]));
const racksById = new Map((mockData.racks || []).map((rack) => [rack.rack_id, rack]));
const modelsById = new Map((mockData.device_models || []).map((model) => [model.model_id, model]));
const vendorsById = new Map((mockData.vendors || []).map((vendor) => [vendor.vendor_id, vendor]));

function DevicesList() {
  const [devices, setDevices] = useState(() => (mockData.devices || []).map((device) => {
    const rack = racksById.get(device.rack_id);
    const room = rack ? roomsById.get(rack.room_id) : null;
    const site = room ? sitesById.get(room.site_id) : null;
    const model = modelsById.get(device.model_id);
    const vendor = model ? vendorsById.get(model.vendor_id) : null;

    return {
      ...device,
      rack_code: rack?.code ?? "Sin rack",
      room_name: room?.name ?? "Sin sala",
      site_name: site?.name ?? "Sin sitio",
      model_name: model?.model_name ?? "Sin modelo",
      vendor_name: vendor?.name ?? "Sin fabricante",
    };
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const rackId = searchParams.get("rack_id");
  const modelId = searchParams.get("model_id");
  const status = searchParams.get("status");

  useEffect(() => {
    const loadDevices = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchJson(
          `/api/devices${buildQueryString({ rack_id: rackId, model_id: modelId, status })}`,
          devices,
        );
        setDevices(Array.isArray(data) ? data : devices);
      } catch (loadError) {
        setDevices(devices);
        setError(loadError.message || "No se pudieron cargar los equipos");
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, [rackId, modelId, status]);

  const activeDevices = devices.filter((device) => device.status === "active").length;
  const maintenanceDevices = devices.filter((device) => device.status === "maintenance").length;
  const retiredDevices = devices.filter((device) => device.status === "retired").length;

  return (
    <div className="devices-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="devices-page__main">
        <section className="devices-page__content">
          <header className="devices-page__header">
            <div>
              <p className="devices-page__eyebrow">Equipos</p>
              <h1 className="devices-page__title">Equipos</h1>
              <p className="devices-page__subtitle">Inventario físico instalado en racks y salas</p>
            </div>

            <div className="devices-page__actions">
              <Link to="/racks" className="devices-page__create">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Ver Racks
              </Link>
            </div>
          </header>

          {rackId || modelId || status ? (
            <div className="devices-page__note">
              Filtros activos{rackId ? ` · rack ${rackId}` : ""}{modelId ? ` · modelo ${modelId}` : ""}{status ? ` · estado ${status}` : ""}.
            </div>
          ) : null}

          <div className="devices-page__stats">
            <div className="devices-stat-card">
              <p className="devices-stat-card__label">Total</p>
              <p className="devices-stat-card__value">{devices.length}</p>
            </div>
            <div className="devices-stat-card">
              <p className="devices-stat-card__label">Activos</p>
              <p className="devices-stat-card__value">{activeDevices}</p>
            </div>
            <div className="devices-stat-card">
              <p className="devices-stat-card__label">Mantenimiento</p>
              <p className="devices-stat-card__value">{maintenanceDevices}</p>
            </div>
            <div className="devices-stat-card">
              <p className="devices-stat-card__label">Retirados</p>
              <p className="devices-stat-card__value">{retiredDevices}</p>
            </div>
          </div>

          <div className="devices-page__card">
            {error ? <div className="devices-page__empty">{error}</div> : null}
            {isLoading ? (
              <div className="devices-page__empty">Cargando equipos...</div>
            ) : devices.length === 0 ? (
              <div className="devices-page__empty">Todavía no hay equipos para mostrar.</div>
            ) : (
              <table className="devices-table">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Modelo</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.device_id}>
                      <td>
                        <div className="devices-table__primary">
                          <strong>{device.name}</strong>
                          <span>{device.asset_tag ?? "Sin asset tag"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="devices-table__secondary">
                          <strong>{device.model_name}</strong>
                          <span>{device.vendor_name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="devices-table__secondary">
                          <strong>{device.site_name}</strong>
                          <span>{device.room_name} · {device.rack_code}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`devices-table__status devices-table__status--${device.status}`}>
                          {device.status}
                        </span>
                      </td>
                      <td>
                        <div className="devices-table__actions">
                          <Link to={`/devices/${device.device_id}`} className="devices-table__btn">Ver detalle</Link>
                          <Link to={`/devices/${device.device_id}?mode=edit`} className="devices-table__icon-btn" aria-label={`Gestionar ${device.name}`}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3l-.5-.5a2.1 2.1 0 0 0-3 0L4 16v4Z" />
                              <path d="M13.5 6.5 17.5 10.5" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DevicesList;