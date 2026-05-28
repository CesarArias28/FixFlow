import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const IncidenceForm = () => {

    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tenantId, setTenantId] = useState("1");
    const [propertyId, setPropertyId] = useState("1");
    const [assets, setAssets] = useState([]);
    const [assetId, setAssetId] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!propertyId) {
                setAssets([]);
                setAssetId("");
                return;
            }
            try {
                const response = await fetch(`${backendUrl}/assets?property_id=${propertyId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssets(data);
                } else {
                    setAssets([]);
                }
            } catch (error) {
                console.error("Error al obtener los activos:", error);
                setAssets([]);
            }
        };

        if (backendUrl) {
            fetchAssets();
        }
    }, [propertyId, backendUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg({ type: "", text: "" });
        if (!backendUrl) {
            setStatusMsg({ type: "danger", text: "Error: VITE_BACKEND_URL no está definida." });
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/incidences`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    tenant_id: parseInt(tenantId),
                    property_id: parseInt(propertyId),
                    asset_id: assetId ? parseInt(assetId) : null
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMsg({ type: "success", text: "¡Incidencia reportada con éxito!" });
                setTitle("");
                setDescription("");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setStatusMsg({ type: "danger", text: data.message || "Error al crear la incidencia." });
            }
        } catch (error) {
            setStatusMsg({ type: "danger", text: "Error de red al conectar con el servidor." });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-gradient bg-primary text-white text-center py-4 border-0 rounded-top-4">
                            <h3 className="mb-0 fw-bold">Reportar Nueva Avería</h3>
                            <p className="mb-0 text-white-50">FixFlow - Canal de Atención Directo</p>
                        </div>
                        <div className="card-body p-4">
                            {statusMsg.text && (
                                <div className={`alert alert-${statusMsg.type} alert-dismissible fade show`} role="alert">
                                    {statusMsg.text}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-semibold">Título de la Avería</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg rounded-3"
                                        id="title"
                                        placeholder="Ej. Fuga de agua en cocina"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label fw-semibold">Descripción del Problema</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        id="description"
                                        rows="4"
                                        placeholder="Detalla lo que ocurre para que podamos evaluarlo rápido..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="row mb-4 g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="tenant" className="form-label fw-semibold">Inquilino</label>
                                        <select
                                            className="form-select rounded-3"
                                            id="tenant"
                                            value={tenantId}
                                            onChange={(e) => setTenantId(e.target.value)}
                                        >
                                            <option value="1">Test User 1 (ID: 1)</option>
                                            <option value="2">Test User 2 (ID: 2)</option>
                                            <option value="3">Test User 3 (ID: 3)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="property" className="form-label fw-semibold">Inmueble</label>
                                        <select
                                            className="form-select rounded-3"
                                            id="property"
                                            value={propertyId}
                                            onChange={(e) => setPropertyId(e.target.value)}
                                        >
                                            <option value="1">Calle Falsa 123 (ID: 1)</option>
                                            <option value="2">Tanwa House (ID: 2)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="asset" className="form-label fw-semibold">Activo / Equipo (Opcional)</label>
                                        <select
                                            className="form-select rounded-3"
                                            id="asset"
                                            value={assetId}
                                            onChange={(e) => setAssetId(e.target.value)}
                                        >
                                            <option value="">Ninguno / No aplica</option>
                                            {assets.map((ast) => (
                                                <option key={ast.id} value={ast.id}>
                                                    {ast.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg rounded-3 bg-gradient fw-bold border-0 shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Enviando reporte...
                                            </>
                                        ) : (
                                            "Enviar Reporte"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};