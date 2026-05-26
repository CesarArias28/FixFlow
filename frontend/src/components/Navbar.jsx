import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		dispatch({ type: "logout" });
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
			<div className="container">
				<Link to="/" className="navbar-brand fw-bold text-gradient">
					FixFlow
				</Link>

				<div className="d-flex align-items-center gap-2">
					{!store.token ? (
						<Link to="/login" className="btn btn-primary rounded-pill px-4 bg-gradient border-0">
							Iniciar Sesión
						</Link>
					) : (
						<>
							<span className="text-white-50 me-3 small">
								{store.email}
							</span>

							{store.role === "tecnico" && (
								<Link to="/technician" className="btn btn-outline-light rounded-pill px-3">
									Portal Técnico
								</Link>
							)}

							{store.role === "inquilino" && (
								<Link to="/incidence/new" className="btn btn-outline-light rounded-pill px-3">
									Reportar Avería
								</Link>
							)}

							{(store.role === "administrador" || store.role === "inmobiliaria") && (
								<Link to="/dashboard" className="btn btn-outline-light rounded-pill px-3">
									Panel Admin
								</Link>
							)}

							<button onClick={handleLogout} className="btn btn-danger rounded-pill px-3 bg-gradient border-0">
								Cerrar Sesión
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};