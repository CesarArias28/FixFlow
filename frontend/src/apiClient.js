const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
export const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const url = `${backendUrl}${endpoint}`;

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("email");
            window.dispatchEvent(new Event("auth_changed")); 
        }

        return response;
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
};
