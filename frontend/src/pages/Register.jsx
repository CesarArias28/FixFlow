import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [phonePrefix, setPhonePrefix] = useState("+34");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${backendUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    pin_code: pinCode,
                    phone_prefix: phonePrefix,
                    phone_number: phoneNumber
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("¡Registro exitoso! Redirigiendo al login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(data.message || "Error al registrar.");
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
                    <CardTitle className="text-2xl font-bold">Registro de Inquilino</CardTitle>
                    <CardDescription>Crea tu cuenta ingresando el PIN de tu inmueble</CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 text-center font-medium">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-50 text-emerald-600 text-sm p-3 rounded-md mb-4 text-center font-medium border border-emerald-200">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pinCode">Código PIN del Inmueble</Label>
                            <Input
                                type="text"
                                id="pinCode"
                                placeholder="Ej: 95MCPZ"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                                required
                            />
                            <p className="text-xs text-slate-500">Solicítalo a tu administrador o inmobiliaria.</p>
                        </div>

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
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1 space-y-2">
                                <Label htmlFor="prefix">Prefijo</Label>
                                <Input
                                    type="text"
                                    id="prefix"
                                    placeholder="+34"
                                    value={phonePrefix}
                                    onChange={(e) => setPhonePrefix(e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="phone">Número de WhatsApp</Label>
                                <Input
                                    type="text"
                                    id="phone"
                                    placeholder="612345678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Usado para recibir notificaciones automáticas.</p>


                        <Button type="submit" className="w-full mt-6" disabled={loading}>
                            {loading ? "Creando cuenta..." : "Crear Cuenta"}
                        </Button>

                        <div className="text-center mt-4 text-sm text-slate-500">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline">Inicia Sesión</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
