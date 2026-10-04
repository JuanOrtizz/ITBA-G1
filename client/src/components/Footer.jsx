import logo from "../../assets/img/logo.svg";

function Footer({ onNavigate }) {
  const irA = (vista) => (e) => {
    e.preventDefault();
    onNavigate(vista);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="Hermanos Jota" />

            <h3>Hermanos Jota</h3>

            <p>
              Mueblería de autor. Carpintería de banco, maderas locales y
              terminaciones al aceite.
            </p>
          </div>

          <div className="footer-col">
            <h3>Ubicación</h3>

            <p>Av. San Juan 2847, CABA</p>

            <p>Lun a Vie: 10:00 - 19:00</p>
            <p>Sábados: 10:00 - 14:00</p>
          </div>

          <div className="footer-col">
            <h3>Contacto</h3>

            <p>WhatsApp: +54 11 4567-8890</p>

            <p>Email: info@hermanosjota.com</p>

            <p>Instagram: @muebleria_hnos_jota</p>
          </div>

          <div className="footer-col">
            <h3>Sitio</h3>

            <a href="#" onClick={irA("inicio")}>
              Inicio
            </a>
            <a href="#" onClick={irA("catalogo")}>
              Catálogo
            </a>
            <a href="#" onClick={irA("contacto")}>
              Contacto
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Hermanos Jota. Todos los derechos reservados.</p>
        </div>
        <div className="container">
          <p>Desarrollado por Ctrl + 5</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
