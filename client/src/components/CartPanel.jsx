import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CartPanel({ recargarProductos }) {
  const {
    carrito,
    carritoAbierto,
    totalCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    cerrarCarrito,
  } = useCart();

  const { usuario, token } = useAuth();
  const navigate = useNavigate();

  const [enviando, setEnviando] = useState(false);
  const [errorCompra, setErrorCompra] = useState(null);
  const [compraExitosa, setCompraExitosa] = useState(null);

  const estaLogueado = Boolean(usuario && token);

  // Limpia mensajes viejos cuando el usuario cierra el panel
  const handleCerrar = useCallback(() => {
    setErrorCompra(null);
    setCompraExitosa(null);
    cerrarCarrito();
  }, [cerrarCarrito]);

  useEffect(() => {
    if (!carritoAbierto) return;

    const cerrarConEscape = (e) => {
      if (e.key === "Escape") handleCerrar();
    };

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [carritoAbierto, handleCerrar]);

  function handleIrALogin() {
    handleCerrar();
    navigate("/login");
  }

  async function handleFinalizarCompra() {
    if (carrito.length === 0 || enviando) return;

    // no enviamos la petición sin la sesión activa
    if (!estaLogueado) {
      setErrorCompra("Necesitás iniciar sesión para finalizar tu compra.");
      return;
    }

    const items = carrito.map((item) => ({
      producto: item._id || item.id,
      nombre: item.nombre,
      precio: Number(item.precio) || 0,
      cantidad: Number(item.cantidad) || 1,
      imagenUrl: item.imagenUrl || "",
    }));

    setErrorCompra(null);
    setCompraExitosa(null);
    setEnviando(true);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          total: totalCarrito,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "No se pudo completar el pedido.",
        );
      }

      // Aqui solo vaciamos el carrito tras confirmar éxito del backend
      vaciarCarrito();
      if (recargarProductos) {
        await recargarProductos();
      }
      setCompraExitosa(data.mensaje || "¡Pedido creado con éxito!");
    } catch (err) {
      const mensaje =
        err instanceof TypeError
          ? "No pudimos conectarnos con el servidor. Tu carrito sigue guardado."
          : err.message;
      setErrorCompra(mensaje);
    } finally {
      setEnviando(false);
    }
  }

  if (!carritoAbierto) return null;

  return (
    <div
      id="panel-carrito"
      className="is-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCerrar();
      }}
    >
      <div className="carrito-panel__contenido">
        <div className="carrito-panel__encabezado">
          <h2>Tu carrito</h2>

          <button
            type="button"
            className="carrito-panel__cerrar"
            aria-label="Cerrar carrito"
            onClick={handleCerrar}
          >
            &times;
          </button>
        </div>

        <div className="carrito-panel__productos">
          {compraExitosa && (
            <div className="carrito-alerta carrito-alerta--exito" role="status">
              <p>{compraExitosa}</p>
            </div>
          )}

          {carrito.length === 0 ? (
            !compraExitosa && <p>Tu carrito está vacío.</p>
          ) : (
            carrito.map((producto) => {
              const productoId = producto._id || producto.id;
              return (
                <div className="carrito-item" key={productoId}>
                  {producto.imagenUrl && (
                    <img src={producto.imagenUrl} alt={producto.nombre} />
                  )}

                  <div>
                    <h3>{producto.nombre}</h3>
                    <div className="controles-cantidad">
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(productoId, -1)}
                      >
                        -
                      </button>

                      <span>{producto.cantidad}</span>

                      <button
                        type="button"
                        onClick={() => cambiarCantidad(productoId, 1)}
                        disabled={producto.cantidad >= (Number(producto.stock) || 0)}
                      >
                        +
                      </button>
                    </div>
                    <p>
                      $
                      {(producto.precio * producto.cantidad).toLocaleString(
                        "es-AR",
                      )}
                    </p>
                    <button
                      type="button"
                      className="boton-eliminar-item"
                      onClick={() => eliminarDelCarrito(productoId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="carrito-panel__pie">
          <div className="carrito-panel__total">
            <span>Total:</span>
            <strong>${totalCarrito.toLocaleString("es-AR")}</strong>
          </div>

          {errorCompra && (
            <p className="carrito-alerta carrito-alerta--error" role="alert">
              {errorCompra}
            </p>
          )}

          {carrito.length > 0 &&
            (estaLogueado ? (
              <button
                type="button"
                className="btn btn-primary carrito-panel__checkout-btn"
                onClick={handleFinalizarCompra}
                disabled={enviando}
              >
                {enviando ? "Procesando pedido..." : "Finalizar compra"}
              </button>
            ) : (
              <div className="carrito-login-aviso">
                <p>Iniciá sesión para finalizar tu compra.</p>
                <button
                  type="button"
                  className="btn btn-primary carrito-panel__checkout-btn"
                  onClick={handleIrALogin}
                >
                  Iniciar sesión para comprar
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CartPanel;