import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import logo from "../../assets/img/logo.svg";

function Navbar({ cartCount, onCartClick }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const { usuario, cargando, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const cerrarTodo = () => {
    setMenuAbierto(false);
    setDropdownAbierto(false);
  };

  const claseNav = ({ isActive }) => (isActive ? "activo" : undefined);
  const claseDropdown = ({ isActive }) =>
    `user-dropdown-item${isActive ? " activo" : ""}`;

  // Cierra el desplegable al hacer clic afuera o presionar Escape
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAbierto(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleToggleDropdown = () => {
    setDropdownAbierto((prev) => !prev);
    setMenuAbierto(false);
  };

  const handleToggleMenu = () => {
    setMenuAbierto((prev) => !prev);
    setDropdownAbierto(false);
  };

  const handleLogout = () => {
    logout();
    cerrarTodo();
    navigate("/");
  };

  const primerNombre = usuario?.nombre
    ? usuario.nombre.split(" ")[0]
    : "Cuenta";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={cerrarTodo}>
          <img src={logo} alt="Hermanos Jota" />
          <span className="logo-text">Hermanos Jota</span>
        </Link>

        <nav className={`site-nav ${menuAbierto ? "is-open" : ""}`}>
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={claseNav} onClick={cerrarTodo}>
                Inicio
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/productos"
                className={claseNav}
                onClick={cerrarTodo}
              >
                Catálogo
              </NavLink>
            </li>

            <li>
              <NavLink to="/contacto" className={claseNav} onClick={cerrarTodo}>
                Contacto
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          {!cargando && (
            <div className="user-menu" ref={dropdownRef}>
              <button
                type="button"
                className={`user-menu-btn${dropdownAbierto ? " is-open" : ""}`}
                aria-label={
                  usuario ? `Cuenta de ${primerNombre}` : "Opciones de cuenta"
                }
                aria-expanded={dropdownAbierto}
                aria-haspopup="true"
                onClick={handleToggleDropdown}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                {usuario && (
                  <span className="user-menu-name">{primerNombre}</span>
                )}

                <svg
                  className="user-menu-chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {dropdownAbierto && (
                <div className="user-dropdown" role="menu">
                  {usuario ? (
                    <>
                      <div className="user-dropdown-header">
                        <span className="user-dropdown-greeting">
                          Hola, {usuario.nombre || "usuario"}
                        </span>
                        {usuario.email && (
                          <span className="user-dropdown-email">
                            {usuario.email}
                          </span>
                        )}
                      </div>

                      <NavLink
                        to="/perfil"
                        className={claseDropdown}
                        role="menuitem"
                        onClick={() => setDropdownAbierto(false)}
                      >
                        Perfil
                      </NavLink>

                      <NavLink
                        to="/mis-pedidos"
                        className={claseDropdown}
                        role="menuitem"
                        onClick={() => setDropdownAbierto(false)}
                      >
                        Mis pedidos
                      </NavLink>

                      <div className="user-dropdown-divider" />

                      <button
                        type="button"
                        className="user-dropdown-item user-dropdown-logout"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className={claseDropdown}
                        role="menuitem"
                        onClick={() => setDropdownAbierto(false)}
                      >
                        Iniciar sesión
                      </NavLink>

                      <NavLink
                        to="/registro"
                        className={claseDropdown}
                        role="menuitem"
                        onClick={() => setDropdownAbierto(false)}
                      >
                        Registrarse
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            className="cart-btn"
            type="button"
            aria-label={`Carrito con ${cartCount} productos`}
            onClick={onCartClick}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6h15l-1.5 9h-12L5 3H2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" />
            </svg>

            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          <button
            className="nav-toggle"
            type="button"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            onClick={handleToggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
