import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

import "./styles/styles.css";

function App() {
  const [vistaActual, setVistaActual] = useState("inicio");
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <Navbar cartCount={cartCount} onNavigate={setVistaActual} />

      <main>
        {vistaActual === "inicio" && <Hero onExplore={() => setVistaActual("catalogo")} />}

        {vistaActual === "catalogo" && <h1>Catálogo</h1>}

        {vistaActual === "detalle" && <h1>Detalle del producto</h1>}

        {vistaActual === "contacto" && <h1>Contacto</h1>}
      </main>

      <Footer />
    </>
  );
}

export default App;
