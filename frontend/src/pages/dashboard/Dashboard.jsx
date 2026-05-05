import Sidebar from "../../components/layout/Sidebar";
import "./Dashboard.css";

function Dashboard() {
	return (
			<div className="app-shell">
			<div className="app-shell__sidebar">
				<Sidebar />
			</div>
			<main className="dashboard">
				<section className="dashboard__panel">
					<div className="dashboard__badge">
						DCIM Dashboard
					</div>
					<div className="dashboard__heading">
						<h1 className="dashboard__title">
							Dashboard del DCIM
						</h1>
						<p className="dashboard__description">
							Bienvenido al Dashboard del DCIM
						</p>
					</div>
					<div className="stats-grid">
						<article className="stat-card">
							<p className="stat-card__label">Sitios</p>
							<p className="stat-card__value">0</p>
						</article>
						<article className="stat-card">
							<p className="stat-card__label">Racks</p>
							<p className="stat-card__value">0</p>
						</article>
						<article className="stat-card">
							<p className="stat-card__label">Dispositivos</p>
							<p className="stat-card__value">0</p>
						</article>
					</div>
				</section>
			</main>
		</div>
	)
}

export default Dashboard
