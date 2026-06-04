import React, { useState, useEffect } from "react";
import { apiClient } from "../apiClient";
import { RefreshCw, ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const Dashboard = () => {
    const [incidences, setIncidences] = useState([]);
    const [activeTab, setActiveTab] = useState("activas");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [technicians, setTechnicians] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchIncidences = async () => {
        setLoading(true);
        try {
            const response = await apiClient("/incidences");
            if (response.ok) {
                const data = await response.json();
                setIncidences(data);
            } else {
                setError("No se pudieron cargar las incidencias.");
            }
        } catch (err) {
            setError("Error de red al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        setLoading(true);
        try {
            const response = await apiClient("/technicians");
            if (response.ok) {
                const data = await response.json();
                setTechnicians(data);
            }
            else {
                setError("No se encontro el tecnico");
            }
        } catch (err) {
            setError("Error de red al conectar el servidor.")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (backendUrl) {
            fetchTechnicians(); fetchIncidences()
        } else {
            setError("La variable VITE_BACKEND_URL no está definida.");
        }
    }, [backendUrl]);

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

    const handleAssignTechnician = async (incidenceId, technicianId) => {
        try {
            const response = await apiClient(`/incidences/${incidenceId}`, {
                method: "PUT",
                body: JSON.stringify({ "technician_id": technicianId ? parseInt(technicianId) : null })
            });

            if (response.ok) {
                setIncidences(prev =>
                    prev.map(inc => (inc.id === incidenceId ? { ...inc, technician_id: technicianId ? parseInt(technicianId) : null } : inc))
                );
            } else {
                alert("Error al asignar el técnico en el servidor.");
            }
        } catch (err) {
            alert("Error de red al intentar asignar el técnico.");
        }
    };

    const handleUpdateField = async (id, field, value) => {
        try {
            const response = await apiClient(`/incidences/${id}`, {
                method: "PUT",
                body: JSON.stringify({ [field]: value })
            });

            if (response.ok) {
                setIncidences(prev =>
                    prev.map(inc => (inc.id === id ? { ...inc, [field]: value } : inc))
                );
            } else {
                alert(`Error al actualizar ${field} en el servidor.`);
            }
        } catch (err) {
            alert(`Error de red al intentar actualizar ${field}.`);
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

    const assetIncidenceCounts = {};
    incidences.forEach((inc) => {
        if (inc.asset_id && inc.asset_name) {
            assetIncidenceCounts[inc.asset_name] = (assetIncidenceCounts[inc.asset_name] || 0) + 1;
        }
    });
    const criticalAssets = Object.keys(assetIncidenceCounts).filter(
        (name) => assetIncidenceCounts[name] >= 3
    );

    const totalIncidences = incidences.length;
    const pendingIncidences = incidences.filter(inc => inc.status === "Pendiente").length;
    const resolvedIncidences = incidences.filter(inc => inc.status === "Resuelto").length;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
                        <p className="text-slate-500 mt-1">Gestión general de incidencias y mantenimiento</p>
                    </div>
                    <button
                        onClick={fetchIncidences}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refrescar Datos
                    </button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Incidencias</p>
                            <h3 className="text-2xl font-bold text-slate-900">{totalIncidences}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pendientes</p>
                            <h3 className="text-2xl font-bold text-slate-900">{pendingIncidences}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Resueltas</p>
                            <h3 className="text-2xl font-bold text-slate-900">{resolvedIncidences}</h3>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {criticalAssets.length > 0 && (
                        <div className="bg-red-50/80 border border-red-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-100 p-2.5 rounded-full shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h4 className="text-red-900 font-bold mb-1">Mantenimiento Preventivo Requerido</h4>
                                    <p className="text-red-700/90 text-sm mb-4">
                                        Los siguientes activos han acumulado 3 o más averías y requieren inspección técnica urgente o sustitución:
                                    </p>
                                    <ul className="flex flex-wrap gap-3">
                                        {criticalAssets.map((name) => (
                                            <li key={name} className="flex items-center gap-2 text-sm text-red-800 bg-red-100/60 px-3 py-1.5 rounded-lg border border-red-200/50 shadow-sm">
                                                <span className="font-bold">{name}</span>
                                                <span className="text-red-400">|</span>
                                                <span>{assetIncidenceCounts[name]} averías</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando incidencias...</span>
                            </div>
                        </div>
                    ) : incidences.length === 0 ? (
                        <div className="text-center py-5 border rounded-3 bg-light">
                            <p className="lead text-muted mb-0">No se han registrado incidencias hasta el momento.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex border-b border-slate-200 mb-4">
                                <button
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "activas" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                                    onClick={() => setActiveTab("activas")}
                                >
                                    Activas
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "completadas" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                                    onClick={() => setActiveTab("completadas")}
                                >
                                    Incidencias resueltas
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                                                <th className="py-4 px-6 font-medium">ID</th>
                                                <th className="py-4 px-6 font-medium">Título / Inmueble</th>
                                                <th className="py-4 px-6 font-medium">Descripción</th>
                                                <th className="py-4 px-6 font-medium text-center">Estado</th>
                                                <th className="py-4 px-6 font-medium text-center">Categorías</th>
                                                <th className="py-4 px-6 font-medium text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(activeTab === "activas" ? incidences.filter(i => i.status !== "Resuelto") : incidences.filter(i => i.status === "Resuelto")).map((inc) => (
                                                <tr key={inc.id} className="hover:bg-slate-50/50 transition-colors group">

                                                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">
                                                        #{inc.id}
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <div className="text-sm font-semibold text-slate-900 mb-0.5">{inc.title}</div>
                                                        <div className="text-xs text-slate-500 mb-2">Inmueble ID: {inc.property_id}</div>

                                                        {inc.asset_name && (
                                                            <div className="flex items-center gap-2">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${criticalAssets.includes(inc.asset_name)
                                                                    ? "bg-red-50 text-red-700 border-red-200"
                                                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                                                    }`}>
                                                                    {inc.asset_name}
                                                                </span>
                                                                {criticalAssets.includes(inc.asset_name) && (
                                                                    <span className="text-xs font-bold text-red-600 animate-pulse">Crítico</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <p className="text-sm text-slate-600 truncate max-w-[250px]" title={inc.description}>
                                                            {inc.description}
                                                        </p>
                                                        <div className="text-xs text-slate-400 mt-1">Inquilino ID: {inc.tenant_id}</div>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        {getStatusBadge(inc.status)}
                                                    </td>

                                                    <td className="py-4 px-6"> <div className="flex flex-col gap-2 w-full max-w-[160px]">
                                                        <select className="w-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 text-slate-700 rounded-md py-1 px-2 focus:ring-red-500 bg-white shadow-sm cursor-pointer" value={inc.severity || ""}
                                                            onChange={(e) => handleUpdateField(inc.id, "severity", e.target.value)}>
                                                            <option value="">Severidad...</option> <option value="Baja">🟢 Baja</option> <option value="Media">🟡 Media</option> <option value="Alta">🔴 Alta</option>
                                                        </select>
                                                        <select className="w-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 text-slate-700 rounded-md py-1 px-2 focus:ring-slate-800 bg-white shadow-sm cursor-pointer"
                                                            value={inc.specialty || ""} onChange={(e) => handleUpdateField(inc.id, "specialty", e.target.value)}
                                                        > <option value="">Especialidad...</option> <option value="Plomeria">Plomería</option> <option value="Electricidad"> Electricidad</option>
                                                            <option value="Climatizacion">Climatización</option> <option value="General">General</option> </select><select className="w-full text-[11px] font-bold uppercase tracking-wider border border-emerald-200 text-emerald-800 rounded-md py-1 px-2 focus:ring-emerald-500 bg-emerald-50 shadow-sm cursor-pointer"
                                                                value={inc.technician_id || ""} onChange={(e) => handleAssignTechnician(inc.id, e.target.value)} > <option value="">Sin técnico</option> {technicians.map((tech) => (<option key={tech.id} value={tech.id}> {tech.email} </option>))} </select> </div> </td>

                                                    <td className="py-4 px-6">
                                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                                            {inc.status === "Pendiente" && (
                                                                <button
                                                                    className="text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors border border-blue-200"
                                                                    onClick={() => handleUpdateStatus(inc.id, "En progreso")}
                                                                >
                                                                    Iniciar
                                                                </button>
                                                            )}
                                                            {inc.status !== "Resuelto" && (
                                                                <button
                                                                    className="text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200"
                                                                    onClick={() => handleUpdateStatus(inc.id, "Resuelto")}
                                                                >
                                                                    Resolver
                                                                </button>
                                                            )}
                                                            {inc.status === "Resuelto" && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        className="text-xs font-medium px-3 py-1.5 bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-slate-200 shadow-sm flex items-center gap-1"
                                                                        title="Descargar Reporte PDF"
                                                                        onClick={() => window.open(`${backendUrl}/incidences/${inc.id}/pdf`, "_blank")}
                                                                    >
                                                                        <ClipboardList className="w-3.5 h-3.5" /> PDF
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};