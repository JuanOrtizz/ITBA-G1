import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || "";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Este efecto se ejecuta solo una vez, cuando la app carga.
    useEffect(() => {
        const checkAuth = () => {
            const savedToken = localStorage.getItem("authToken");
            if (!savedToken) {
                setCargando(false);
                return;
            }
            try {
                const decodedUser = jwtDecode(savedToken);

                // Comprobar si el token expiró
                if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
                    localStorage.removeItem("authToken");
                    setCurrentUser(null);
                    setToken(null);
                    return;
                }

                // Si el token sigue vigente, restaurar la sesión
                setToken(savedToken);
                setCurrentUser(decodedUser);
            } catch (error) {
                localStorage.removeItem("authToken");
                setCurrentUser(null);
                setToken(null);
                console.error("Error al restaurar la sesión:", error);
            } finally {
                setCargando(false);
            }
        };
        checkAuth();
    }, []);

    async function login({ email, password }){
        const respuesta = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || datos.mensaje || "No se pudo iniciar sesión");
        }
        localStorage.setItem("authToken", datos.token);
        const decodedUser = jwtDecode(datos.token);
        setToken(datos.token);
        setCurrentUser(decodedUser);
    }

    function logout() {
        localStorage.removeItem("authToken");
        setToken(null);
        setCurrentUser(null);
    }
    
    async function register({ username, email, password }) {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.mensaje || "Error al registrarse");
        }
        await login({ email, password });
    }
    
    const value = { currentUser, token, cargando, login, register, logout };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};