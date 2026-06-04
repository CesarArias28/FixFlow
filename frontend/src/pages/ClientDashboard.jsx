import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const ClientDashboard = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const [incidences, setIncidences] = useState([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!store.token) {
            navigate("/login");
            return;
        }
        
        fetchIncidences();
    }, [store.token]);

    const fetchIncidences = async () => {
        try {
            const response = await fetch(`${backendUrl}/incidences`, {
                headers: {
                    "Authorization": `Bearer ${store.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Sort by ID descending (newest first)
                data.sort((a, b) => b.id - a.id);
                setIncidences(data);
            }
        } catch (error) {
            console.error("Error fetching incidences:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pendiente":
                return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
            case "En progreso":
            case "En Progreso":
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200"><Wrench className="w-3 h-3 mr-1" /> En Progreso</Badge>;
            case "Resuelto":
                return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Resuelto</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Portal</h1>
                    <p className="text-muted-foreground mt-1">Sigue el estado de las averías que has reportado.</p>
                </div>
                <Button asChild className="gap-2 shadow-sm">
                    <Link to="/incidence/new">
                        <Plus className="w-4 h-4" />
                        Reportar Nueva Avería
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-pulse flex flex-col items-center">
                        <Wrench className="w-8 h-8 text-muted-foreground mb-4 animate-spin" />
                        <p className="text-muted-foreground">Cargando tus reportes...</p>
                    </div>
                </div>
            ) : incidences.length === 0 ? (
                <Card className="bg-muted/40 border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Todo en orden</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            No has reportado ninguna avería aún. Si tienes algún problema en tu inmueble, puedes reportarlo aquí.
                        </p>
                        <Button asChild variant="outline">
                            <Link to="/incidence/new">Reportar Avería</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incidences.map((inc) => (
                        <Card key={inc.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3 flex-row items-start justify-between space-y-0 gap-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg line-clamp-1" title={inc.title}>{inc.title}</CardTitle>
                                    <CardDescription className="text-xs">Reporte #{inc.id}</CardDescription>
                                </div>
                                <div>
                                    {getStatusBadge(inc.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4">
                                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                                    {inc.description}
                                </p>
                                
                                {inc.asset_name && (
                                    <div className="flex items-center gap-2 mt-auto text-xs text-slate-500 bg-slate-50 p-2 rounded-md">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>Activo afectado: <span className="font-medium text-slate-700">{inc.asset_name}</span></span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
