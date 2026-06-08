import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiClient } from "../apiClient";
import { LogoFixFlow } from "../components/LogoFixFlow";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const IncidenceForm = () => {

    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const propertyId = store.property_id;
    const [assets, setAssets] = useState([]);
    const [assetId, setAssetId] = useState("");
    const [customAssetName, setCustomAssetName] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
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
                const response = await apiClient(`/assets?property_id=${propertyId}`);
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

        if (true) {
            fetchAssets();
        }
    }, [propertyId, backendUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg({ type: "", text: "" });
        if (false) {
            setStatusMsg({ type: "danger", text: "Error: VITE_BACKEND_URL no está definida." });
            setLoading(false);
            return;
        }
        try {
            const response = await apiClient("/incidences", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                    tenant_id: parseInt(store.userId),
                    property_id: parseInt(propertyId),
                    asset_id: (assetId && assetId !== "other") ? parseInt(assetId) : null,
                    custom_asset_name: assetId === "other" ? customAssetName : null
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
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <Card className="w-full max-w-2xl shadow-lg border-0">
                <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg mb-6 pt-8 pb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                            <LogoFixFlow className="w-16 h-16 text-primary-foreground drop-shadow-md" />
                        </div>
                        <CardTitle className="text-2xl drop-shadow-sm">Reportar Nueva Avería</CardTitle>
                        <CardDescription className="text-primary-foreground/90 mt-1">FixFlow - Canal de Atención Directo</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {statusMsg.text && (
                        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show`} role="alert">
                            {statusMsg.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="title">Título de la Avería</Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Ej. Fuga de agua en cocina"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>                        <div className="space-y-2 mb-4">
                            <Label htmlFor="description">Descripción del Problema</Label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                id="description"
                                rows="4"
                                placeholder="Detalla lo que ocurre para que podamos evaluarlo rápido..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="asset">Activo Afectado (Opcional)</Label>
                                <Select value={assetId || "none"} onValueChange={(value) => setAssetId(value === "none" ? "" : value)}>
                                    <SelectTrigger id="asset">
                                        <SelectValue placeholder="Ninguno / No aplica" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Ninguno / No aplica</SelectItem>
                                        {assets.map((ast) => (
                                            <SelectItem key={ast.id} value={ast.id.toString()}>
                                                {ast.name}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="other">Otro (Añadir nuevo...)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {assetId === "other" && (
                                    <div className="mt-2">
                                        <Input
                                            type="text"
                                            placeholder="Ej. Caldera del portal 2"
                                            value={customAssetName}
                                            onChange={(e) => setCustomAssetName(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                            {loading ? "Enviando reporte..." : "Enviar Reporte"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
};
