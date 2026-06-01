import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiClient } from "../apiClient";

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
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Pendiente</span>;
            case "En progreso":
                return <span className="badge bg-info text-white px-3 py-2 rounded-pill">En Progreso</span>;
            case "Resuelto":
                return <span className="badge bg-success text-white px-3 py-2 rounded-pill">Resuelto</span>;
            default:
                return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="mb-4 text-white">
                        <h2 className="fw-bold mb-1">Portal del Técnico</h2>
                        <p className="text-white-50">Gestiona tus reparaciones asignadas (Sesión de: {store.email})</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger rounded-3" role="alert">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando incidencias...</span>
                            </div>
                        </div>
                    ) : incidences.length === 0 ? (
                        <div className="text-center py-5 border border-secondary rounded-4 bg-secondary bg-opacity-10 text-black-50">
                            <p className="lead mb-0">No tienes incidencias asignadas en este momento.</p>
                            <p className="small">Las incidencias asignadas a tu cuenta aparecerán aquí.</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {incidences.map((inc) => (
                                <div key={inc.id} className="card bg-secondary bg-opacity-25 border-0 rounded-4 p-4 text-white shadow-sm">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <span className="text-primary fw-bold">Incidencia #{inc.id}</span>
                                            <h4 className="fw-bold mt-1 mb-0">{inc.title}</h4>
                                        </div>
                                        <div>
                                            {getStatusBadge(inc.status)}
                                        </div>
                                    </div>
                                    <p className="text-white-50 mb-3">{inc.description}</p>
                                    <div className="row g-2 border-top border-secondary pt-3 align-items-center">
                                        <div className="col-sm-6 text-white-50 small">
                                            <div><strong>Inmueble ID:</strong> {inc.property_id}</div>
                                            <div><strong>Severidad:</strong> <span className={`badge ${inc.severity === "Alta" ? "bg-danger" : "bg-secondary"} ms-1`}>{inc.severity || "No asignado"}</span></div>
                                            <div><strong>Especialidad:</strong> <span className="badge bg-dark ms-1">{inc.specialty || "No asignada"}</span></div>
                                        </div>
                                        <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
                                            <div className="d-flex gap-2 justify-content-sm-end">
                                                {inc.status === "Pendiente" && (
                                                    <button
                                                        className="btn btn-info text-white rounded-pill px-4"
                                                        onClick={() => handleUpdateStatus(inc.id, "En progreso")}
                                                    >
                                                        Comenzar Reparación
                                                    </button>
                                                )}
                                                {inc.status !== "Resuelto" && (
                                                    <button
                                                        className="btn btn-success rounded-pill px-4"
                                                        onClick={() => handleUpdateStatus(inc.id, "Resuelto")}
                                                    >
                                                        Marcar como Resuelto
                                                    </button>
                                                )}
                                                {inc.status === "Resuelto" && (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="text-success fw-bold small">✓ Reparación completada</span>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1"
                                                            style={{ fontSize: "0.8rem" }}
                                                            onClick={() => window.open(`${backendUrl}/incidences/${inc.id}/pdf`, "_blank")}
                                                        >
                                                            Reporte PDF
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};