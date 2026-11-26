import { createContext, useContext, useState, useEffect } from "react";

const CART_STORAGE_KEY = "hermanosJota_carrito";

// Esto normaliza el identificador: los productos de MongoDB vienen con _id
function obtenerIdProducto(producto) {
  return producto?._id || producto?.id;
}

function cargarCarritoInicial() {
  try {
    const guardado = localStorage.getItem(CART_STORAGE_KEY);
    if (!guardado) return [];
    const parsed = JSON.parse(guardado);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error al leer el carrito guardado:", error);
    return [];
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(cargarCarritoInicial);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
    }
  }, [carrito]);

  function agregarAlCarrito(producto) {
    const productoId = obtenerIdProducto(producto);
    if (!productoId) return;

    setCarrito((prevCarrito) => {
      const existente = prevCarrito.find(
        (item) => obtenerIdProducto(item) === productoId,
      );

      if (existente) {
        return prevCarrito.map((item) =>
          obtenerIdProducto(item) === productoId
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item,
        );
      }

      return [
        ...prevCarrito,
        {
          ...producto,
          _id: productoId,
          precio: Number(producto.precio) || 0,
          cantidad: 1,
        },
      ];
    });
  }

  function cambiarCantidad(productoId, cambio) {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) =>
          obtenerIdProducto(item) === productoId
            ? { ...item, cantidad: item.cantidad + cambio }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  function eliminarDelCarrito(productoId) {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => obtenerIdProducto(item) !== productoId),
    );
  }

 
  function vaciarCarrito() {
    setCarrito([]);
  }

  const abrirCarrito = () => setCarritoAbierto(true);
  const cerrarCarrito = () => setCarritoAbierto(false);

  const cartCount = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  );

  const value = {
    carrito,
    carritoAbierto,
    cartCount,
    totalCarrito,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    abrirCarrito,
    cerrarCarrito,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}