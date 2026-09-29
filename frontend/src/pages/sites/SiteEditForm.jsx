import { useState } from "react";
import { putJson, postJson } from "../../lib/dcimApi";
import "./SitesList.css";

export default function SiteEditForm({ site, onSave, onCancel }) {
	// El mismo formulario sirve para crear un sitio o editar uno existente.
  const [formData, setFormData] = useState({
    name: site.name || "",
    city: site.city || "",
    address: site.address || "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Mantiene sincronizado el estado controlado de cada input.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Decide entre POST y PUT según exista el identificador del sitio.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
      };

      if (site.site_id) {
        await putJson(`/api/sites/${site.site_id}`, payload);
      } else {
        await postJson("/api/sites", payload);
      }

      onSave();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="site-detail-form" onSubmit={handleSubmit}>
      <fieldset className="site-detail-fieldset" disabled={isSaving}>
        <legend>{site.site_id ? "Editar sitio" : "Nuevo sitio"}</legend>

        {error && <div className="site-detail-error">{error}</div>}

        <div className="form-group">
          <label>Nombre del sitio *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ciudad *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Dirección *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Las acciones permiten guardar o cerrar el modal sin persistir cambios. */}
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
