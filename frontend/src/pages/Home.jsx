import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-between">
			<div className="container py-5 my-auto">
				<div className="row align-items-center justify-content-center text-center">
					<div className="col-lg-8">
						<span className="badge bg-primary bg-gradient px-3 py-2 rounded-pill mb-3 fs-6">
							FixFlow v1.0
						</span>
						<h1 className="display-3 fw-bold mb-4">
							Gestión Inteligente de Incidencias
						</h1>
						<p className="lead text-white-50 mb-5">
							La plataforma definitiva para la comunicación fluida entre inquilinos y propietarios.
							Reporta averías en segundos, clasifica con inteligencia artificial y haz seguimiento en tiempo real.
						</p>

						<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
							<Link to="/incidence/new" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg bg-gradient border-0 fw-bold">
								Reportar Avería
							</Link>
							<Link to="/dashboard" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold">
								Panel de Control Admin
							</Link>
						</div>
					</div>
				</div>


				<div className="row g-4 mt-5 pt-4 text-start">
					<div className="col-md-4">
						<div className="card bg-secondary bg-opacity-25 border-0 rounded-4 p-4 h-100 shadow-sm hover-transform">
							<div className="fs-2 mb-3 text-primary"></div>
							<h5 className="fw-bold text-white mb-2">Reportes en Segundos</h5>
							<p className="text-white-50 mb-0">
								Formulario simplificado para inquilinos con carga de detalles letra a letra en tiempo real.
							</p>
						</div>
					</div>


					<div className="col-md-4">
						<div className="card bg-secondary bg-opacity-25 border-0 rounded-4 p-4 h-100 shadow-sm hover-transform">
							<div className="fs-2 mb-3 text-info"></div>
							<h5 className="fw-bold text-white mb-2">Triaje Automatizado (IA)</h5>
							<p className="text-white-50 mb-0">
								Clasificación instantánea de severidad y especialidad técnica del reporte utilizando inteligencia artificial.
							</p>
						</div>
					</div>


					<div className="col-md-4">
						<div className="card bg-secondary bg-opacity-25 border-0 rounded-4 p-4 h-100 shadow-sm hover-transform">
							<div className="fs-2 mb-3 text-success"></div>
							<h5 className="fw-bold text-white mb-2">Seguimiento en Vivo</h5>
							<p className="text-white-50 mb-0">
								Panel dinámico de administración para actualizar estados y agilizar reparaciones de forma reactiva.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};