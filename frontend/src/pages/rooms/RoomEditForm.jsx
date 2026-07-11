import { useEffect, useState } from "react";
import { fetchJson, putJson, postJson } from "../../lib/dcimApi";
import "./RoomsList.css";

export default function RoomEditForm({ room, siteId, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    site_id: room.site_id || siteId || "",
    name: room.name || "",
    floor: room.floor || "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const loadSites = async () => {
      const data = await fetchJson("/api/sites", []);
      setSites(Array.isArray(data) ? data : []);
    };
    loadSites();
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
        site_id: Number(formData.site_id),
        name: formData.name.trim(),
        floor: formData.floor.trim(),
      };

      if (room.room_id) {
        await putJson(`/api/rooms/${room.room_id}`, payload);
      } else {
        await postJson("/api/rooms", payload);
      }

      onSave();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="room-detail-form" onSubmit={handleSubmit}>
      <fieldset className="room-detail-fieldset" disabled={isSaving}>
        <legend>{room.room_id ? "Editar sala" : "Nueva sala"}</legend>

        {error && <div className="room-detail-error">{error}</div>}

        <div className="form-group">
          <label>Sitio *</label>
          <select name="site_id" value={formData.site_id} onChange={handleChange} required>
            <option value="">Selecciona un sitio</option>
            {sites.map((site) => (
              <option key={site.site_id} value={site.site_id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nombre de la sala *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Piso *</label>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-submit">
            Guardar
          </button>
          <button type="button" className="form-cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </fieldset>
    </form>
  );
}
