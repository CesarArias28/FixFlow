import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export const IncidenceForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [tenantId, setTenantId] = useState("1");
    const [propertyId, setPropertyId] = useState("1");

    const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg({ type: "", text: "" });
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
                    property_id: parseInt(propertyId)
                })
            })
        }}
};