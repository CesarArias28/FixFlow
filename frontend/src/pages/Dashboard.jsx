import React, { useState, useEffect } from "react";

export const Dashboard = () => {
    const [incidences, setIncidences] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [technicians, setTechnicians] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchIncidences = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/incidences`);
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
            const response = await fetch(`${backendUrl}/technicians`);
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
            const response = await fetch(`${backendUrl}/incidences/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
            const response = await fetch(`${backendUrl}/incidences/${incidenceId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
    const assetIncidenceCounts = {};
    incidences.forEach((inc) => {
        if (inc.asset_id && inc.asset_name) {
            assetIncidenceCounts[inc.asset_name] = (assetIncidenceCounts[inc.asset_name] || 0) + 1;
        }
    });
    const criticalAssets = Object.keys(assetIncidenceCounts).filter(
        (name) => assetIncidenceCounts[name] >= 3
    );
        return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Panel de Control de Incidencias</h2>
                    <p className="text-muted">Consola de administración para la gestión de averías</p>
                </div>
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={fetchIncidences}>
                    Refrescar datos
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {criticalAssets.length > 0 && (
                <div className="alert alert-danger shadow-sm rounded-4 mb-4 border-0 p-4" role="alert">
                    <div className="d-flex align-items-start">
                        <span className="fs-3 me-3"></span>
                        <div>
                            <h5 className="alert-heading fw-bold mb-1">Mantenimiento Preventivo Requerido</h5>
                            <p className="mb-0 small text-muted">
                                Los siguientes activos han acumulado **3 o más averías** y requieren inspección técnica urgente o sustitución:
                            </p>
                            <ul className="mt-2 mb-0 fw-semibold text-danger small">
                                {criticalAssets.map((name) => (
                                    <li key={name}>
                                        {name} ({assetIncidenceCounts[name]} averías registradas)
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
                <div className="card shadow border-0 rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark bg-gradient">
                                <tr>
                                    <th className="py-3 px-4" style={{ width: "80px" }}>ID</th>
                                    <th className="py-3">Título / Inmueble</th>
                                    <th className="py-3">Descripción</th>
                                    <th className="py-3 text-center">Estado</th>
                                    <th className="py-3 text-center">Severidad / Especialidad</th>
                                    <th className="py-3 text-center" style={{ width: "260px" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidences.map((inc) => (
                                    <tr key={inc.id}>
                                        <td className="fw-bold px-4">#{inc.id}</td>
                                                                                <td>
                                            <div className="fw-bold">{inc.title}</div>
                                            <small className="text-muted d-block">Inmueble ID: {inc.property_id}</small>
                                            {inc.asset_name && (
                                                <div className="mt-1 d-flex align-items-center gap-2">
                                                    <span className={`badge ${criticalAssets.includes(inc.asset_name) ? "bg-danger text-white" : "bg-light text-secondary"} px-2 py-1 rounded-pill small`}>
                                                             {inc.asset_name}
                                                    </span>
                                                    {criticalAssets.includes(inc.asset_name) && (
                                                        <span className="text-danger small fw-bold" style={{ fontSize: "0.75rem" }}>
                                                             Crítico
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <p className="mb-0 text-truncate" style={{ maxWidth: "300px" }} title={inc.description}>
                                                {inc.description}
                                            </p>
                                            <small className="text-muted d-block">Inquilino ID: {inc.tenant_id}</small>
                                        </td>
                                        <td className="text-center">
                                            {getStatusBadge(inc.status)}
                                        </td>
                                        <td className="text-center">
                                            <div className="mb-1">
                                                <span className={`badge ${inc.severity === "Alta" ? "bg-danger" : "bg-secondary"} px-2 py-1`}>
                                                    {inc.severity || "No asignado"}
                                                </span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="badge bg-dark px-2 py-1">
                                                    {inc.specialty || "No asignada"}
                                                </span>
                                            </div>
                                            <div style={{ maxWidth: "160px" }} className="mx-auto">
                                                <select
                                                    className="form-select form-select-sm rounded-3"
                                                    value={inc.technician_id || ""}
                                                    onChange={(e) => handleAssignTechnician(inc.id, e.target.value)}
                                                >
                                                    <option value="">Sin asignar</option>
                                                    {technicians.map((tech) => (
                                                        <option key={tech.id} value={tech.id}>
                                                            {tech.email}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2 justify-content-center">
                                                {inc.status === "Pendiente" && (
                                                    <button
                                                        className="btn btn-sm btn-info text-white rounded-pill px-3"
                                                        onClick={() => handleUpdateStatus(inc.id, "En progreso")}
                                                    >
                                                        Iniciar
                                                    </button>
                                                )}
                                                {inc.status !== "Resuelto" && (
                                                    <button
                                                        className="btn btn-sm btn-success rounded-pill px-3"
                                                        onClick={() => handleUpdateStatus(inc.id, "Resuelto")}
                                                    >
                                                        Resolver
                                                    </button>
                                                )}
                                                                                                {inc.status === "Resuelto" && (
                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                        <span className="text-success small fw-bold">Completado</span>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-pill px-2 py-0"
                                                            style={{ fontSize: "0.75rem" }}
                                                            onClick={() => window.open(`${backendUrl}/incidences/${inc.id}/pdf`, "_blank")}
                                                        >
                                                            PDF
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
            )}
        </div>)
};