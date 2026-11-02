import ProductForm from "./ProductForm";

function EditProduct({ recargarProductos }) {
  return (
    <section id="contenedor-editar-producto">
      <h2>Edición de Producto</h2>
      <p>Modifique los campos que quiera para actualizar el catálogo</p>
      <ProductForm recargarProductos={recargarProductos} />
    </section>
  );
}

export default EditProduct;
