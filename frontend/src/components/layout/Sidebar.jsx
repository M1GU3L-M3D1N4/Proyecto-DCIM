import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navigationItems = [
	{ to: "/", label: "Dashboard" },
	{ to: "/sites", label: "Sitios" },
	{ to: "/racks", label: "Racks" },
	{ to: "/devices", label: "Equipos" },
	{ to: "/vendors", label: "Fabricantes" },
	{ to: "/models", label: "Modelos" },
];

function Sidebar() {
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
						className={({ isActive }) =>
							[
								"sidebar__link",
								isActive
									? "sidebar__link--active"
									: "",
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