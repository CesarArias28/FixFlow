import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiClient } from "../apiClient";
import { Wrench, MapPin, CheckCircle2, ClipboardList, AlertCircle } from "lucide-react";

export const TechnicianDashboard = () => {
    const { store } = useGlobalReducer();
    const [incidences, setIncidences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const techId = store.userId;

    const fetchAssignedIncidences = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiClient(`/incidences?technician_id=${techId}`);
            if (response.ok) {
                const data = await response.json();
                setIncidences(data);

            } else {
                setError("No se pudieron cargar las incidencias asignadas.");
            }
        } catch (err) {
            setError("Error de red al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (backendUrl && techId) {
            fetchAssignedIncidences();
        }
    }, [techId, backendUrl]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await apiClient(`/incidences/${id}`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setIncidences(prev =>
                    prev.map(inc => (inc.id === id ? { ...inc, status: newStatus } : inc))
                );
            } else {
                alert("Error al actualizar el estado en el servidor.");
            }
        } catch (err) {
            alert("Error de red al intentar actualizar la incidencia.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pendiente":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Pendiente</span>;
            case "En progreso":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">En Progreso</span>;
            case "Resuelto":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Resuelto</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-slate-900 text-white px-6 pt-10 pb-8 rounded-b-3xl shadow-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Wrench className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Portal Técnico</h2>
                </div>
                <p className="text-slate-400 text-sm">Sesión: {store.email}</p>
            </div>

            <div className="px-4 sm:px-6 max-w-2xl mx-auto space-y-4">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                        <p className="text-red-700 font-medium text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                ) : incidences.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm mt-8">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">¡Estás al día!</h3>
                        <p className="text-slate-500 text-sm">No tienes incidencias asignadas en este momento.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {incidences.map((inc) => (
                            <div key={inc.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="pr-4">
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 block">Incidencia #{inc.id}</span>
                                        <h4 className="text-lg font-bold text-slate-900 leading-tight">{inc.title}</h4>
                                    </div>
                                    <div className="shrink-0 mt-1">
                                        {getStatusBadge(inc.status)}
                                    </div>
                                </div>
                                
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{inc.description}</p>
                                
                                <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 border border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span><strong className="font-semibold text-slate-700">Inmueble:</strong> ID {inc.property_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                        <div className="flex gap-2">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${inc.severity === "Alta" ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-600"}`}>
                                                {inc.severity || "Sin severidad"}
                                            </span>
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white">
                                                {inc.specialty || "General"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones Anchos (Mobile) */}
                                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
                                    {inc.status === "Pendiente" && (
                                        <button
                                            className="w-full py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm flex justify-center items-center gap-2 border border-blue-200"
                                            onClick={() => handleUpdateStatus(inc.id, "En progreso")}
                                        >
                                            <Wrench className="w-4 h-4" /> Comenzar Reparación
                                        </button>
                                    )}
                                    {inc.status !== "Resuelto" && (
                                        <button
                                            className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-sm flex justify-center items-center gap-2"
                                            onClick={() => handleUpdateStatus(inc.id, "Resuelto")}
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Marcar Resuelto
                                        </button>
                                    )}
                                    {inc.status === "Resuelto" && (
                                        <div className="w-full flex items-center justify-between bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                                            <span className="text-emerald-700 font-bold text-sm flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> Completada
                                            </span>
                                            <button
                                                className="text-slate-600 hover:text-red-600 text-sm font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
                                                onClick={() => window.open(`${backendUrl}/incidences/${inc.id}/pdf`, "_blank")}
                                            >
                                                <ClipboardList className="w-3 h-3" /> PDF
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )};
