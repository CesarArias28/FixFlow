import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { LogoFixFlow } from "./LogoFixFlow";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		dispatch({ type: "logout" });
		navigate("/login");
	};

	return (
		<nav className="w-full border-b bg-background px-6 py-4 flex items-center justify-between shadow-sm">
			<Link to="/">
				<LogoFixFlow className="w-32 h-auto" />
			</Link>

			<div className="flex items-center gap-4">
				{!store.token ? (
					<Button asChild className="rounded-full px-6">
						<Link to="/login">Iniciar Sesión</Link>
					</Button>
				) : (
					<>
						<span className="text-muted-foreground text-sm mr-2">
							{store.email}
						</span>

						{store.role === "tecnico" && (
							<Button asChild variant="outline" className="rounded-full">
								<Link to="/technician">Portal Técnico</Link>
							</Button>
						)}

						{store.role === "inquilino" && (
							<Button asChild variant="outline" className="rounded-full">
								<Link to="/incidence/new">Reportar Avería</Link>
							</Button>
						)}

						{(store.role === "administrador" || store.role === "inmobiliaria") && (
							<Button asChild variant="outline" className="rounded-full">
								<Link to="/dashboard">Panel Admin</Link>
							</Button>
						)}

						<Button onClick={handleLogout} variant="destructive" className="rounded-full px-5">
							Cerrar Sesión
						</Button>
					</>
				)}
			</div>
		</nav>
	);
};