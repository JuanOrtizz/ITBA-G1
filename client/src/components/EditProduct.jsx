import ProductForm from "./ProductForm";

function EditProduct() {
    return (
        <section id="contenedor-editar-producto">
            <h2>Edición de Producto</h2>
            <p>Modifique los campos que quiera para actualizar el catálogo</p>
            <ProductForm />
        </section>
    );
}

export default EditProduct;