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
				icon: (<img src="public/icons/dashboard.svg" alt="Dashboard" />),
			},
			{
				to: "/sites",
				label: "Sitios",
				icon: (<img src="public/icons/sites.svg" alt="Sitios" />
				),
			},
			{
				to: "/rooms",
				label: "Salas",
				icon: (<img src="public/icons/rooms.svg" alt="Salas" />),
			},
			{
				to: "/racks",
				label: "Racks",
				icon: (<img src="public/icons/racks.svg" alt="Racks" />),
			},
			{
				to: "/devices",
				label: "Equipos",
				icon: (<img src="public/icons/devices.svg" alt="Equipos" />),
			},
		],
	},
	{
		title: "Catálogos",
		items: [
			{
				to: "/vendors",
				label: "Fabricantes",
				icon: (<img src="public/icons/vendors.svg" alt="Fabricantes" />),
			},
			{
				to: "/models",
				label: "Modelos",
				icon: (<img src="public/icons/models.svg" alt="Modelos" />),
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
							<img src="public/icons/dcim.svg" alt="Logo DCIM" className="sidebar__logo-icon"/>			
						</div>
						<div className="sidebar__brand-text">
							<p className="sidebar__title">DCIM System</p>
							<p className="sidebar__subtitle">Gestión de Datacenter</p>
						</div>
					</div>
					<button
						type="button"
						className="sidebar__collapse"
						onClick={() => setIsCollapsed((value) => !value)}
						aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
						aria-pressed={isCollapsed}
					>
						<img
							src={isCollapsed ? "/icons/chevron-right.svg" : "/icons/chevron-left.svg"}
							alt=""
							aria-hidden="true"
							className="sidebar__collapse-icon"
						/>
					</button>
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