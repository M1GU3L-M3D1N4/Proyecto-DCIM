import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

// Lista de rutas mostradas en la barra lateral.
// Estructura: { to: string, label: string }
// Mantenerla aquí facilita añadir/quitar ítems sin tocar la lógica de render.
const navigationItems = [
	{ to: "/dashboard", label: "Dashboard" },
	{ to: "/sites", label: "Sitios" },
	{ to: "/racks", label: "Racks" },
	{ to: "/devices", label: "Equipos" },
	{ to: "/vendors", label: "Fabricantes" },
	{ to: "/models", label: "Modelos" },
];


/**
 * Sidebar
 *
 * Componente presentacional que renderiza la navegación lateral.
 * Responsabilidades:
 * - Renderizar `navigationItems` en orden.
 * - Aplicar la clase de estado activo a la ruta seleccionada.
 * - No realiza comprobaciones de permisos ni fetches.
 */
function Sidebar() {
	const navigate = useNavigate();

	// Leer datos del usuario desde localStorage (opcional, solo para mostrar
	// información si está disponible). Fallos en parseo se silencian.
	const user = (() => {
		try {
			const raw = localStorage.getItem("user");
			return raw ? JSON.parse(raw) : null;
		} catch (e) {
			return null;
		}
	})();

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<aside className="sidebar">
			<div className="sidebar__brand">
				<div className="sidebar__logo">
					<svg viewBox="0 0 24 24" className="sidebar__logo-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
						<path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z" />
						<path d="M12 3v18" />
						<path d="m5 7 7 4 7-4" />
					</svg>
				</div>
				<div>
					<p className="sidebar__title">DCIM</p>
					<p className="sidebar__subtitle">Gestión de Datacenter</p>
				</div>
			</div>

			<nav className="sidebar__nav">
				{navigationItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						// `isActive` controla el modificador visual. Dejar la lógica
						// en la función permite personalizar clases si se necesita.
						className={({ isActive }) =>
							[
								"sidebar__link",
								isActive ? "sidebar__link--active" : "",
							].join(" ")
						}
					>
						<span className="sidebar__link-icon">
							<span className="sidebar__link-marker" />
						</span>
						<span>{item.label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
}

export default Sidebar;