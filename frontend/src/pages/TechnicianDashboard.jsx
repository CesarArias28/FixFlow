import React, { useState, useEffect } from "react";
export const TechnicianDashboard = () => {
    const [techId, setTechId] = useState("3"); 
    const [incidences, setIncidences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchAssignedIncidences = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${backendUrl}/incidences?technician_id=${techId}`);
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
    }}