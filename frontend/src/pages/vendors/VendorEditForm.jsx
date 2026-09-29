import { useState } from "react";
import { putJson } from "../../lib/dcimApi";

export default function VendorEditForm({ vendor, onSave, onCancel }) {
	// El formulario inicia sus campos con el fabricante seleccionado.
  const [formData, setFormData] = useState({
    name: vendor.name || "",
    support_url: vendor.support_url || "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Actualiza únicamente el campo que cambió para conservar el resto del formulario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Normaliza cadenas y envía la actualización al backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        support_url: formData.support_url.trim() || null,
      };

      await putJson(`/api/vendors/${vendor.vendor_id}`, payload);
      onSave();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="vendor-detail-form" onSubmit={handleSubmit}>
      <fieldset className="vendor-detail-fieldset">
        <legend>Editar fabricante</legend>

        {error && <div className="vendor-detail-error">{error}</div>}

        <div className="form-group">
          <label>Nombre del fabricante *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL de soporte</label>
          <input
            type="url"
            name="support_url"
            value={formData.support_url}
            onChange={handleChange}
            placeholder="https://example.com/support"
          />
        </div>

        {/* Mientras se guarda se deshabilita el submit para evitar duplicados. */}
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
