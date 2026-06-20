import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { fetchJson } from "../../lib/dcimApi";
import DeviceEditForm from "./DeviceEditForm";
import "./DeviceDetail.css";

function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadDevice = async () => {
    setIsLoading(true);
    const data = await fetchJson(`/api/devices/${id}`, null);
    setDevice(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDevice();
  }, [id]);

  const handleSaveDevice = async () => {
    setIsEditing(false);
    await loadDevice();
  };

  if (isLoading) {
    return (
      <div className="device-detail-page">
        <Sidebar theme="light" mode="drawer" />
        <main className="device-detail-page__main">
          <section className="device-detail-page__content">
            <div className="device-detail-page__empty">Cargando equipo...</div>
          </section>
        </main>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="device-detail-page">
        <Sidebar theme="light" mode="drawer" />
        <main className="device-detail-page__main">
          <section className="device-detail-page__content">
            <div className="device-detail-page__empty">No encontramos ese equipo.</div>
            <button type="button" className="device-detail-page__back" onClick={() => navigate("/devices")}>Volver a equipos</button>
          </section>
        </main>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="device-detail-page">
        <Sidebar theme="light" mode="drawer" />
        <main className="device-detail-page__main">
          <section className="device-detail-page__content">
            <DeviceEditForm
              device={device}
              onSave={handleSaveDevice}
              onCancel={() => setIsEditing(false)}
            />
          </section>
        </main>
      </div>
    );
  }

  const rackCode = device.rack_code ?? "Sin rack";
  const roomName = device.room_name ?? "Sin sala";
  const siteName = device.site_name ?? "Sin sitio";
  const modelName = device.model_name ?? "Sin modelo";
  const vendorName = device.vendor_name ?? "Sin fabricante";

  return (
    <div className="device-detail-page">
      <Sidebar theme="light" mode="drawer" />

      <main className="device-detail-page__main">
        <section className="device-detail-page__content">
          <header className="device-detail-page__header">
            <div>
              <button type="button" className="device-detail-page__back" onClick={() => navigate("/devices")}>← Volver</button>
              <p className="device-detail-page__eyebrow">Detalle de equipo</p>
              <h1 className="device-detail-page__title">{device.name}</h1>
              <p className="device-detail-page__subtitle">{siteName} · {roomName} · {rackCode}</p>
            </div>

            <div className="device-detail-page__actions">
                    <button type="button" onClick={() => setIsEditing(true)} className="device-detail-page__primary">Editar equipo</button>
              <Link to="/racks" className="device-detail-page__secondary">Ver racks</Link>
            </div>
          </header>

          <div className="device-detail-page__summary">
            <div className="device-detail-card">
              <p className="device-detail-card__label">Estado</p>
              <p className="device-detail-card__value">{device.status}</p>
            </div>
            <div className="device-detail-card">
              <p className="device-detail-card__label">Posición</p>
              <p className="device-detail-card__value">U {device.u_start ?? "N/D"}</p>
            </div>
            <div className="device-detail-card">
              <p className="device-detail-card__label">Modelo</p>
              <p className="device-detail-card__value">{modelName}</p>
            </div>
            <div className="device-detail-card">
              <p className="device-detail-card__label">Fabricante</p>
              <p className="device-detail-card__value">{vendorName}</p>
            </div>
          </div>

          <div className="device-detail-page__grid">
            <article className="device-detail-panel">
              <div className="device-detail-panel__header">
                <h2>Información general</h2>
              </div>
              <div className="device-detail-panel__body">
                <p><strong>Asset tag:</strong> {device.asset_tag ?? "N/D"}</p>
                <p><strong>Serial:</strong> {device.serial_number ?? "N/D"}</p>
                <p><strong>Instalado:</strong> {device.installed_at ?? "N/D"}</p>
                <p><strong>Tipo:</strong> {device.device_type ?? "N/D"}</p>
              </div>
            </article>

            <article className="device-detail-panel">
              <div className="device-detail-panel__header">
                <h2>Ubicación</h2>
              </div>
              <div className="device-detail-panel__body">
                <p><strong>Sitio:</strong> {siteName}</p>
                <p><strong>Sala:</strong> {roomName}</p>
                <p><strong>Rack:</strong> {rackCode}</p>
                <p><strong>Fabricante:</strong> {vendorName}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DeviceDetail;