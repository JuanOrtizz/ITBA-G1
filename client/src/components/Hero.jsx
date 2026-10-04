function Hero({ onExplore }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="hero-kicker">Mobiliario con alma y herencia</span>

        <h1>El redescubrimiento de un arte olvidado</h1>

        <p className="hero-subtitle">
          Cada pieza cuenta la historia de manos expertas y materiales nobles.
          Honramos la tradición mientras abrazamos el futuro.
        </p>

        <button className="btn btn-primary" onClick={onExplore}>
          Ver catálogo
        </button>
      </div>
    </section>
  );
}

export default Hero;
