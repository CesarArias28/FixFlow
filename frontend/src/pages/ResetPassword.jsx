import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setMessage({ type: "danger", text: "La contraseña debe tener al menos 6 caracteres." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: "danger", text: "Las contraseñas no coinciden." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch(`${backendUrl}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ 
                    type: "success", 
                    text: "¡Tu contraseña ha sido restablecida con éxito! Redirigiéndote al inicio de sesión..." 
                });
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setMessage({ type: "danger", text: data.message || "Error al restablecer la contraseña." });
            }
        } catch (err) {
            setMessage({ type: "danger", text: "Error de red al conectar con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card bg-secondary bg-opacity-25 border-0 rounded-4 p-4 text-white shadow-lg">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold mb-1">Nueva Contraseña</h2>
                            <p className="text-white-50">Establece tu nueva contraseña de acceso seguro</p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type} rounded-3`} role="alert">
                                {message.text}
                            </div>
                        )}

                        {!token ? (
                            <div className="text-center py-3">
                                <div className="alert alert-warning rounded-3 mb-4">
                                    No se ha detectado ningún token de recuperación válido en el enlace.
                                </div>
                                <Link to="/forgot-password" className="btn btn-primary rounded-pill px-4">
                                    Solicitar nuevo enlace
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label htmlFor="new-password" className="form-label fw-semibold">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        id="new-password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirm-password" className="form-label fw-semibold">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        id="confirm-password"
                                        placeholder="Repite la contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success btn-lg rounded-3 border-0 fw-bold bg-gradient" 
                                        disabled={loading}
                                    >
                                        {loading ? "Actualizando..." : "Restablecer Contraseña"}
                                    </button>
                                    <Link to="/login" className="btn btn-outline-light rounded-3 fw-bold">
                                        Volver al Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
