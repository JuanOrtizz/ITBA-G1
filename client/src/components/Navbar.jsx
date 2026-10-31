import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "../../assets/img/logo.svg";

function Navbar({ cartCount, onCartClick }) {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarMenu = () => setMenuAbierto(false);

    const claseNav = ({ isActive }) => (isActive ? "activo" : undefined);

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="logo" onClick={cerrarMenu}>
                    <img src={logo} alt="Hermanos Jota" />
                    <span className="logo-text">Hermanos Jota</span>
                </Link>

                <nav className={`site-nav ${menuAbierto ? "is-open" : ""}`}>
                    <ul className="nav-list">
                        <li>
                            <NavLink to="/" end className={claseNav} onClick={cerrarMenu}>
                                Inicio
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/productos" className={claseNav} onClick={cerrarMenu}>
                                Catálogo
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/contacto" className={claseNav} onClick={cerrarMenu}>
                                Contacto
                            </NavLink>
                        </li>

                        <li>
                            <Link to={"/admin/crear-producto"} className={location.pathname === "/admin/crear-producto" ? "active" : ""} onClick={() => setMenuAbierto(false)}>
                                Crear Producto
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">
                    <button className="cart-btn" type="button" aria-label={`Carrito con ${cartCount} productos`} onClick={onCartClick}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6h15l-1.5 9h-12L5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
                            <circle cx="18" cy="20" r="1.4" fill="currentColor" />
                        </svg>

                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>

                    <button className="nav-toggle" type="button" aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuAbierto} onClick={() => setMenuAbierto(!menuAbierto)}>
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
