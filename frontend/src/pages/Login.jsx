import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                if (data.property_id) {
                    localStorage.setItem("property_id", data.property_id);
                }

                dispatch({
                    type: "login",
                    payload: {
                        token: data.access_token,
                        role: data.role,
                        userId: data.user_id,
                        email: data.email,
                        property_id: data.property_id
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
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">FixFlow Acceso</CardTitle>
                    <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    ¿La olvidaste?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={loading}>
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};