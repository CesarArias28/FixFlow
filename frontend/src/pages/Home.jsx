import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Home = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center p-6">
			<Badge variant="secondary" className="mb-4">FixFlow v1.0</Badge>
			<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-center">
				Gestión Inteligente de Incidencias
			</h1>
			<p className="text-xl text-muted-foreground text-center max-w-2xl">
				La plataforma definitiva para la comunicación fluida entre inquilinos y propietarios.
				Reporta averías en segundos, clasifica con inteligencia artificial y haz seguimiento en tiempo real.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
				<Button asChild variant="outline">
					<Link to="/incidence/new">Reportar Avería</Link>
				</Button>
				<Button asChild variant="default">
					<Link to="/dashboard">Panel de Control Admin</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">

			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle>Reportes en Segundos</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Formulario simplificado para inquilinos con carga de detalles letra a letra en tiempo real.
					</p>
				</CardContent>
			</Card>


			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle>Triaje Automatizado (IA)</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Clasificación instantánea de severidad y especialidad técnica del reporte utilizando inteligencia artificial.
					</p>
				</CardContent>
			</Card>



			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle>Seguimiento en Vivo</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Panel dinámico de administración para actualizar estados y agilizar reparaciones de forma reactiva.
					</p>
				</CardContent>
			</Card>
		</div>
		</div>
	)
}
