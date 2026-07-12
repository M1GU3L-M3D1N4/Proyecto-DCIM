import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

// La navegación queda agrupada según el modelo de datos:
// operación diaria primero y catálogos de referencia al final.
const navigationSections = [
	{
		title: "Operación",
		items: [
			{
				to: "/dashboard",
				label: "Dashboard",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M4 4h6v6H4z" />
						<path d="M14 4h6v6h-6z" />
						<path d="M4 14h6v6H4z" />
						<path d="M14 14h6v6h-6z" />
					</svg>
				),
			},
			{
				to: "/sites",
				label: "Sitios",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M4 20h16" />
						<path d="M7 20V8h10v12" />
						<path d="M9 8V5h6v3" />
					</svg>
				),
			},
			{
				to: "/rooms",
				label: "Salas",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M4 6h16v12H4z" />
						<path d="M8 6V4h8v2" />
						<path d="M8 12h8" />
					</svg>
				),
			},
			{
				to: "/racks",
				label: "Racks",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M5 6h14v5H5z" />
						<path d="M5 13h14v5H5z" />
					</svg>
				),
			},
			{
				to: "/devices",
				label: "Equipos",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M5 7h14v10H5z" />
						<path d="M8 7V4h8v3" />
						<path d="M9 11h6" />
					</svg>
				),
			},
		],
	},
	{
		title: "Catálogos",
		items: [
			{
				to: "/vendors",
				label: "Fabricantes",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="m12 3 8 4v10l-8 4-8-4V7z" />
						<path d="M12 11V3" />
					</svg>
				),
			},
			{
				to: "/models",
				label: "Modelos",
				icon: (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="m12 2 4 7-4 13-4-13z" />
						<path d="M4 9h16" />
					</svg>
				),
			},
		],
	},
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

function Sidebar({ theme = "light", mode = "static" }) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(mode !== "drawer");
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const [userError, setUserError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		let isMounted = true;

		const loadUser = async () => {
			const token = localStorage.getItem("token");

			if (!token) {
				if (!isMounted) return;
				setUser(null);
				setUserError("Sesión no disponible");
				setIsLoadingUser(false);
				return;
			}

			try {
				const response = await fetch("/api/auth/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("No se pudo cargar el usuario");
				}

				const data = await response.json();
				if (!isMounted) return;
				setUser(data);
				setUserError("");
			} catch (error) {
				if (!isMounted) return;
				setUser(null);
				setUserError("No se pudo cargar el usuario");
			} finally {
				if (!isMounted) return;
				setIsLoadingUser(false);
			}
		};

		loadUser();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		window.dispatchEvent(new Event("auth-change"));
		navigate("/");
	};

	return (
		<>
			{mode === "drawer" ? (
				<button
					type="button"
					className="sidebar__toggle"
					onClick={() => setIsDrawerOpen((value) => !value)}
					aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
					aria-expanded={isDrawerOpen}
				>
					<span />
					<span />
					<span />
				</button>
			) : null}
			{mode === "drawer" && isDrawerOpen ? (
				<button
					type="button"
					className="sidebar__overlay"
					onClick={() => setIsDrawerOpen(false)}
					aria-label="Cerrar menú lateral"
				/>
			) : null}
			<aside
				className={[
					"sidebar",
					theme === "light" ? "sidebar--light" : "sidebar--dark",
					isCollapsed ? "sidebar--collapsed" : "",
					mode === "drawer" ? "sidebar--drawer" : "",
					mode === "drawer" && isDrawerOpen ? "sidebar--drawer-open" : "",
				].join(" ")}
			>
				<div className="sidebar__brand">
					<div className="sidebar__brand-main">
						<div className="sidebar__logo">
							<svg viewBox="0 0 24 24" className="sidebar__logo-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z" />
								<path d="M12 3v18" />
								<path d="m5 7 7 4 7-4" />
							</svg>
						</div>
						<div className="sidebar__brand-text">
							<p className="sidebar__title">DCIM System</p>
							<p className="sidebar__subtitle">Gestión de Datacenter</p>
						</div>
					</div>
					{mode === "static" ? (
						<button
							type="button"
							className="sidebar__collapse"
							onClick={() => setIsCollapsed((value) => !value)}
							aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
							aria-pressed={isCollapsed}
						>
							<svg viewBox="0 0 24 24" aria-hidden="true">
								{isCollapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
							</svg>
						</button>
					) : null}
				</div>

				<nav className="sidebar__nav">
					{navigationSections.map((section) => (
						<div key={section.title} className="sidebar__section">
							<p className="sidebar__section-title">{section.title}</p>
							<div className="sidebar__section-links">
								{section.items.map((item) => (
									<NavLink
										key={item.to}
										to={item.to}
										className={({ isActive }) =>
											[
												"sidebar__link",
												isActive ? "sidebar__link--active" : "",
											].join(" ")
										}
										title={isCollapsed ? item.label : undefined}
									>
										<span className="sidebar__link-icon" aria-hidden="true">
											{item.icon}
										</span>
										<span className="sidebar__link-label">{item.label}</span>
									</NavLink>
								))}
							</div>
						</div>
					))}
				</nav>

				<div className="sidebar__footer">
					<div className="sidebar__user">
						<div className="sidebar__user-avatar">
							{isLoadingUser
							? "..."
							: user?.full_name
							? user.full_name.charAt(0).toUpperCase()
							: "U"}
						</div>
						<p className="sidebar__user-name">
							{isLoadingUser ? "Cargando..." : user?.full_name || userError || "Sesión activa"}
						</p>
						<p className="sidebar__user-role">
							{isLoadingUser ? "" : user ? user.job_title || user.username || user.email || "" : ""}
						</p>
					</div>
					<button className="sidebar__logout" onClick={handleLogout} type="button">
						Salir
					</button>
				</div>
			</aside>
		</>
	);
}

export default Sidebar;