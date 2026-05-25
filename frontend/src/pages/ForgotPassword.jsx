import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetStep, setResetStep] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch(`${backendUrl}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "Token generado con éxito. Para propósitos de esta prueba, hemos copiado el token directamente abajo para que puedas restablecer la contraseña."
                });
                setToken(data.reset_token);
                setResetStep(2);
            } else {
                setMessage({ type: "danger", text: data.message || "Error al procesar la solicitud." });
            }
        } catch (err) {
            setMessage({ type: "danger", text: "Error de red al conectar con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
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
                setMessage({ type: "success", text: "¡Contraseña restablecida con éxito! Ya puedes entrar al Login." });
                setNewPassword("");
                setToken("");
                setResetStep(1);
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
                            <h2 className="fw-bold mb-1">Restablecer Contraseña</h2>
                            <p className="text-white-50">
                                {resetStep === 1
                                    ? "Ingresa tu email registrado para recibir tu token de reinicio"
                                    : "Introduce el token recibido y tu nueva contraseña"
                                }
                            </p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type} rounded-3`} role="alert">
                                {message.text}
                            </div>
                        )}

                        {resetStep === 1 ? (
                            <form onSubmit={handleSendEmail}>
                                <div className="mb-4">
                                    <label htmlFor="recovery-email" className="form-label fw-semibold">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-3"
                                        id="recovery-email"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg rounded-3 border-0 fw-bold bg-gradient" disabled={loading}>
                                        {loading ? "Procesando..." : "Obtener Token"}
                                    </button>
                                    <Link to="/login" className="btn btn-outline-light rounded-3 fw-bold">
                                        Volver al Login
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label htmlFor="reset-token" className="form-label fw-semibold">Token de Recuperación</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        id="reset-token"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                    />
                                    <div className="form-text text-white-50">Token decodificado para pruebas de desarrollo.</div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="new-password" className="form-label fw-semibold">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        id="new-password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success btn-lg rounded-3 border-0 fw-bold bg-gradient" disabled={loading}>
                                        {loading ? "Guardando..." : "Establecer Nueva Contraseña"}
                                    </button>
                                    <button type="button" className="btn btn-outline-light rounded-3 fw-bold" onClick={() => setResetStep(1)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};