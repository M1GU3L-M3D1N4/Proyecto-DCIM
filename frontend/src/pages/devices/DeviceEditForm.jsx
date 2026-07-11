import { useEffect, useState } from "react";
import { fetchJson, putJson, postJson } from "../../lib/dcimApi";
import "./DeviceDetail.css";

export default function DeviceEditForm({ device, isCreating, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    model_id: device.model_id || "",
    name: device.name || "",
    asset_tag: device.asset_tag || "",
    serial_number: device.serial_number || "",
    rack_id: device.rack_id || "",
    u_start: device.u_start || "",
    status: device.status || "active",
    installed_at: device.installed_at || "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [models, setModels] = useState([]);
  const [racks, setRacks] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      const [modelsResponse, racksResponse] = await Promise.all([
        fetchJson("/api/models", []),
        fetchJson("/api/racks", []),
      ]);

      setModels(Array.isArray(modelsResponse) ? modelsResponse : []);
      setRacks(Array.isArray(racksResponse) ? racksResponse : []);
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        model_id: Number(formData.model_id),
        rack_id: formData.rack_id ? Number(formData.rack_id) : null,
        u_start: formData.u_start ? Number(formData.u_start) : null,
      };

      if (isCreating) {
        await postJson("/api/devices", payload);
      } else {
        await putJson(`/api/devices/${device.device_id}`, payload);
      }
      onSave();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="device-detail-form" onSubmit={handleSubmit}>
      <fieldset className="device-detail-fieldset">
        <legend>{isCreating ? "Nuevo equipo" : "Editar equipo"}</legend>

        {error && <div className="device-detail-error">{error}</div>}

        <div className="form-group">
          <label>Modelo *</label>
          <select
            name="model_id"
            value={formData.model_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un modelo</option>
            {models.map((model) => (
              <option key={model.model_id} value={model.model_id}>
                {model.vendor_name} - {model.model_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Asset tag</label>
          <input
            type="text"
            name="asset_tag"
            value={formData.asset_tag}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Serial</label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Rack</label>
          <select
            name="rack_id"
            value={formData.rack_id}
            onChange={handleChange}
          >
            <option value="">Sin rack</option>
            {racks.map((rack) => (
              <option key={rack.rack_id} value={rack.rack_id}>
                {rack.site_name || "Sin sitio"} - {rack.room_name || "Sin sala"} - {rack.code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Posición U</label>
          <input
            type="number"
            name="u_start"
            value={formData.u_start}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Activo</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="retired">Retirado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fecha de instalación</label>
          <input
            type="date"
            name="installed_at"
            value={formData.installed_at}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSaving} className="form-submit">
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={onCancel} className="form-cancel">
            Cancelar
          </button>
        </div>
      </fieldset>
    </form>
  );
}
