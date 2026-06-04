import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { LogoFixFlow } from "./LogoFixFlow";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		dispatch({ type: "logout" });
		navigate("/login");
	};

    const getRoleLink = () => {
        let label = "";
        let path = "";
        
        if (store.role === "tecnico") {
            label = "Portal Técnico";
            path = "/technician";
        } else if (store.role === "inquilino") {
            label = "Reportar Avería";
            path = "/incidence/new";
        } else if (store.role === "administrador" || store.role === "inmobiliaria") {
            label = "Panel Admin";
            path = "/dashboard";
        } else {
            return null;
        }

        return (
            <Link to={path} className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors hidden sm:block">
                {label}
            </Link>
        );
    };

	return (
		<nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="flex h-16 items-center px-6 max-w-7xl mx-auto w-full justify-between">
				<div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <LogoFixFlow className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
                            FixFlow
                        </span>
                    </Link>
                    {store.token && getRoleLink()}
                </div>

				<div className="flex-1 flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
				</div>

				<div className="flex items-center gap-4">
					{!store.token ? (
						<>
							<Button asChild variant="ghost" className="rounded-full px-6">
								<Link to="/login">Iniciar sesión</Link>
							</Button>
							<Button asChild className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
								<Link to="/register">Regístrate</Link>
							</Button>
						</>
					) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="h-9 w-9 cursor-pointer border border-border hover:opacity-80 transition-opacity">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${store.email}`} />
                                    <AvatarFallback>{store.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 bg-background border-border shadow-2xl rounded-xl">
                                <DropdownMenuLabel className="font-normal p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none text-foreground">Mi Cuenta</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {store.email}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50 my-1" />
                                <DropdownMenuItem className="p-3 text-muted-foreground focus:bg-zinc-900/50 focus:text-foreground cursor-pointer rounded-lg transition-colors">
                                    <Settings className="w-4 h-4 mr-2" />
                                    <span>Configuración</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="p-3 text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer rounded-lg transition-colors mt-1">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
					)}
				</div>
			</div>
		</nav>
	);
};