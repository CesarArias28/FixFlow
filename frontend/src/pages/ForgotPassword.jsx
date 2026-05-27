import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [resetLink, setResetLink] = useState("");
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
                    text: "Hemos enviado el enlace de recuperación."
                });
                setResetLink(data.reset_link);
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

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card bg-secondary bg-opacity-25 border-0 rounded-4 p-4 text-white shadow-lg">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold mb-1">Recuperar Contraseña</h2>
                            <p className="text-white-50">
                                {resetStep === 1
                                    ? "Ingresa tu email registrado para enviarte un enlace de recuperación"
                                    : "¡Enlace generado con éxito!"
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
                                        {loading ? "Procesando..." : "Enviar enlace de recuperación"}
                                    </button>
                                    <Link to="/login" className="btn btn-outline-light rounded-3 fw-bold">
                                        Volver al Login
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <p className="text-center mb-4">
                                    Por favor, revisa tu correo electrónico. Hemos enviado un enlace único que te permitirá restablecer tu contraseña.
                                </p>

                                <div className="card bg-dark border border-warning rounded-3 p-3 text-start mb-4">
                                    <h6 className="text-warning fw-bold mb-2">🛠️ Simulador de Correo (Desarrollo)</h6>
                                    <p className="small text-white-50 mb-3">
                                        En producción, abrirías tu bandeja de entrada y harías clic en el enlace. Haz clic abajo para simular esa acción:
                                    </p>
                                    <a href={resetLink} className="btn btn-warning btn-sm w-100 fw-bold text-dark rounded-3">
                                        Simular abrir correo y restablecer contraseña
                                    </a>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="button" className="btn btn-outline-light rounded-3 fw-bold" onClick={() => setResetStep(1)}>
                                        Probar con otro correo
                                    </button>
                                    <Link to="/login" className="btn btn-primary rounded-3 fw-bold">
                                        Volver al Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};