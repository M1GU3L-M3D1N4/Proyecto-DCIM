import { useEffect, useState } from "react";
import { fetchJson, postJson, putJson } from "../../lib/dcimApi";
import "./RackDetail.css";

export default function RackEditForm({ rack, onSave, onCancel }) {
  const isEditing = Boolean(rack?.rack_id);
  const [formData, setFormData] = useState({
    room_id: rack.room_id || "",
    code: rack.code || "",
    total_u: rack.total_u || "42",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadRooms = async () => {
      const data = await fetchJson("/api/rooms", []);
      setRooms(Array.isArray(data) ? data : []);
    };
    loadRooms();
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
        room_id: Number(formData.room_id),
        code: formData.code.trim(),
        total_u: Number(formData.total_u),
      };

      if (isEditing) {
        await putJson(`/api/racks/${rack.rack_id}`, payload);
      } else {
        await postJson('/api/racks', payload);
      }
      onSave();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="rack-detail-form" onSubmit={handleSubmit}>
      <fieldset className="rack-detail-fieldset">
        <legend>{isEditing ? "Editar rack" : "Nuevo rack"}</legend>

        {error && <div className="rack-detail-error">{error}</div>}

        <div className="form-group">
          <label>Sala *</label>
          <select
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una sala</option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.name} (Piso {room.floor})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Código del rack *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Capacidad total U *</label>
          <input
            type="number"
            name="total_u"
            value={formData.total_u}
            onChange={handleChange}
            required
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
