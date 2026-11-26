import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
                    localStorage.removeItem("authUser");
                    setCurrentUser(null);
                    setToken(null);
                    return;
                }

                // Si el token sigue vigente, restaurar la sesión.
                // El JWT trae id, email y rol; el nombre sale del user que devolvió el login
                const savedUser = JSON.parse(localStorage.getItem("authUser") || "null");
                setToken(savedToken);
                setCurrentUser({ ...decodedUser, ...savedUser });
            } catch (error) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                setCurrentUser(null);
                setToken(null);
                console.error("Error al restaurar la sesión:", error);
            } finally {
                setCargando(false);
            }
        };
        checkAuth();
    }, []);

    async function login({ email, password }) {
        const respuesta = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.error || datos.message || "No se pudo iniciar sesión");
        }
        localStorage.setItem("authToken", datos.token);
        localStorage.setItem("authUser", JSON.stringify(datos.user));
        const decodedUser = jwtDecode(datos.token);
        setToken(datos.token);
        setCurrentUser({ ...decodedUser, ...datos.user });
    }

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setToken(null);
        setCurrentUser(null);
    }, []);

    const actualizarSesion = useCallback((nuevoUsuario, nuevoToken) => {
        let decodedUser = {};
        if (nuevoToken) {
            localStorage.setItem("authToken", nuevoToken);
            setToken(nuevoToken);
            try {
                decodedUser = jwtDecode(nuevoToken);
            } catch {
                decodedUser = {};
            }
        }
        if (nuevoUsuario) {
            localStorage.setItem("authUser", JSON.stringify(nuevoUsuario));
            setCurrentUser((prev) => ({
                ...prev,
                ...decodedUser,
                ...nuevoUsuario,
            }));
        }
    }, []);

    async function register({ username, email, password }) {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || data.message || "Error al registrarse");
        }
        await login({ email, password });
    }

    // usuario: mismo dato que currentUser, con el nombre que usan Navbar y ProtectedRoute
    const value = {
        currentUser,
        usuario: currentUser,
        token,
        cargando,
        login,
        register,
        logout,
        actualizarSesion,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}