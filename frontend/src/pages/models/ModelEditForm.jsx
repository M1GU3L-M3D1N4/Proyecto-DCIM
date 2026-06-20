import { useState } from "react";
import { putJson } from "../../lib/dcimApi";

export default function ModelEditForm({ model, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vendor_id: model.vendor_id || "",
    model_name: model.model_name || "",
    device_type: model.device_type || "",
    u_height: model.u_height || "1",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        vendor_id: Number(formData.vendor_id),
        model_name: formData.model_name.trim(),
        device_type: formData.device_type.trim(),
        u_height: Number(formData.u_height),
      };

      await putJson(`/api/models/${model.model_id}`, payload);
      onSave();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="model-detail-form" onSubmit={handleSubmit}>
      <fieldset className="model-detail-fieldset">
        <legend>Editar modelo</legend>

        {error && <div className="model-detail-error">{error}</div>}

        <div className="form-group">
          <label>ID del fabricante *</label>
          <input
            type="number"
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre del modelo *</label>
          <input
            type="text"
            name="model_name"
            value={formData.model_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de dispositivo *</label>
          <input
            type="text"
            name="device_type"
            value={formData.device_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Altura U *</label>
          <input
            type="number"
            name="u_height"
            value={formData.u_height}
            onChange={handleChange}
            required
            min="1"
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
