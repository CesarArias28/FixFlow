import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Button } from "@/components/ui/button";

export const Home = () => {
	const { store } = useGlobalReducer();
	const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";

	const getDashboardPath = () => {
		if (store.role === "inquilino") return "/client-dashboard";
		if (store.role === "tecnico") return "/technician";
		return "/dashboard";
	};
	return (
		<div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col overflow-hidden">
			<div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12">
				<div className="flex-1 text-left z-10 w-full lg:max-w-md xl:max-w-lg">
					<h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.15] mb-5 tracking-tight">
						FixFlow <br />
						Mantenimiento <br />
						Inteligente para <br />
						Propiedades <br />
						Modernas
					</h1>
					<p className="text-lg md:text-[1.1rem] text-slate-600 mb-8 max-w-sm leading-relaxed font-light">
						La PropTech definitiva. Reportes directos por WhatsApp, clasificación automática por IA y flujos de trabajo optimizados en segundos.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-12 px-6 text-base font-medium shadow-lg shadow-emerald-600/20">
							{store.role === "administrador" || store.role === "inmobiliaria" ? (
								<a href="/admin/incidence/new" target="_blank" rel="noopener noreferrer">Reportar Avería</a>
							) : (
								<Link to="/incidence/new">Reportar Avería</Link>
							)}
						</Button>
						<Button asChild size="lg" variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg h-12 px-6 text-base font-medium shadow-sm">
							<Link to={getDashboardPath()}>Ver mi Panel de Control</Link>
						</Button>
					</div>
				</div>

				<div className="flex-[1.2] relative w-full h-[400px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">

					<div
						className="absolute top-1/2 left-1/2 w-[110%] h-[110%] bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 opacity-65 transition-transform duration-1000 z-0"
						style={{
							borderRadius: '42% 30% 65% 35% / 45% 36% 64% 55%',
							transform: 'translate(-50%, -50%) rotate(-5deg)'
						}}					></div>

					<div className="relative w-[90%] h-[90%] lg:w-[90%] lg:h-[90%] rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-white z-10">
						<img
							src="/hero-image.png"
							alt="FixFlow Technician Work"
							className="w-full h-full object-cover object-center"
							onError={(e) => {
								e.target.src = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
