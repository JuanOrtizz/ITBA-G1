import { useState } from "react";

function Navbar({ cartCount, onNavigate, onCartClick }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navegar = (vista) => {
    onNavigate(vista);
    setMenuAbierto(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div
          className="logo"
          onClick={() => navegar("inicio")}
          aria-label="Hermanos Jota — inicio"
        >
          <img src="../assets/img/logo.svg" alt="Hermanos Jota" />

          <span className="logo-text">Hermanos Jota</span>
        </div>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`site-nav ${menuAbierto ? "is-open" : ""}`}>
          <ul className="nav-list">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navegar("inicio");
                }}
              >
                Inicio
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navegar("catalogo");
                }}
              >
                Catálogo
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navegar("contacto");
                }}
              >
                Contacto
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
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
        </div>
      </div>
    </header>
  );
}

export default Navbar;
