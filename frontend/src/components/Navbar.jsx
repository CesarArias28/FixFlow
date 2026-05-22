import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
			<div className="container">
				<Link to="/" className="navbar-brand fw-bold text-gradient">
					FixFlow
				</Link>
				<div className="d-flex gap-2">
					<Link to="/incidence/new" className="btn btn-outline-light rounded-pill px-3">
						Reportar Avería
					</Link>
					<Link to="/dashboard" className="btn btn-primary rounded-pill px-3 bg-gradient">
						Panel Admin
					</Link>
				</div>
			</div>
		</nav>
	);
};