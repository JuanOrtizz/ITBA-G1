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
  const stockDisponible = Number(producto.stock) || 0;
  if (stockDisponible <= 0) return;

  const productoId = producto._id || producto.id;

  setCarrito((prev) => {
    const existente = prev.find((item) => (item._id || item.id) === productoId);

    if (existente) {
      // No supera el stock disponible
      if (existente.cantidad >= stockDisponible) return prev;

      return prev.map((item) =>
        (item._id || item.id) === productoId
          ? { ...item, cantidad: item.cantidad + 1, stock: stockDisponible }
          : item
      );
    }

    return [...prev, { ...producto, cantidad: 1, stock: stockDisponible }];
  });
}

function cambiarCantidad(productoId, delta) {
  setCarrito((prev) =>
    prev
      .map((item) => {
        if ((item._id || item.id) !== productoId) return item;

        const nuevaCantidad = item.cantidad + delta;
        const stockMaximo = Number(item.stock) || 0;

        // Si intenta sumar más que el stock, lo frenamos en el máximo
        if (delta > 0 && nuevaCantidad > stockMaximo) {
          return item;
        }

        return { ...item, cantidad: nuevaCantidad };
      })
      .filter((item) => item.cantidad > 0)
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