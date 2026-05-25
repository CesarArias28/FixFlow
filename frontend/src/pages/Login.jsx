import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("email", data.email);
                localStorage.setItem("userId", data.user_id);

                dispatch({
                    type: "login_success",
                    payload: {
                        token: data.access_token,
                        role: data.role,
                        email: data.email,
                        userId: data.user_id
                    }
                });

                if (data.role === "administrador" || data.role === "inmobiliaria") {
                    navigate("/dashboard");
                } else if (data.role === "tecnico") {
                    navigate("/technician");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message || "Error al iniciar sesión.");
            }
        } catch (err) {
            setError("Error de red al conectar con el servidor.");
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
                            <h2 className="fw-bold mb-1">FixFlow Acceso</h2>
                            <p className="text-white-50">Ingresa tus credenciales para continuar</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger rounded-3" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control rounded-3"
                                    id="email"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <label htmlFor="password" className="form-label fw-semibold mb-0">Contraseña</label>
                                    <Link to="/forgot-password" className="text-info small text-decoration-none">
                                        ¿La olvidaste?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    className="form-control rounded-3"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="d-grid mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg rounded-3 bg-gradient fw-bold border-0"
                                    disabled={loading}
                                >
                                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};