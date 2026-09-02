// Aseguramos que el DOM esté completamente cargado antes de ejecutar la lógica
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Capturamos el formulario por su ID
    const formulario = document.getElementById('formulario-contacto');

    // Usamos addEventListener para capturar el evento 'submit'
    formulario.addEventListener('submit', function(e) {
        
        // 2. Usamos e.preventDefault() para evitar que la página se recargue
        e.preventDefault(); 

        // 3. Capturamos los elementos inputs (para obtener sus valores y poner los errores debajo)
        const inputNombre = document.getElementById('nombre');
        const inputEmail = document.getElementById('email');
        const inputMensaje = document.getElementById('mensaje');
        const feedbackContenedor = document.getElementById('mensaje-feedback');

        // Limpiamos los mensajes de error previos y el feedback de éxito
        document.querySelectorAll('.error-span').forEach(span => span.remove());
        feedbackContenedor.textContent = ''; 

        let formularioValido = true;

        // Función auxiliar para crear inyectar los <span> de error sin usar alert()
        const mostrarError = (input, mensajeTexto) => {
            const spanError = document.createElement('span');
            spanError.textContent = mensajeTexto;
            spanError.style.color = 'red';
            spanError.style.display = 'block';
            spanError.style.fontSize = '0.85rem';
            spanError.style.marginTop = '4px';
            spanError.classList.add('error-span'); // Clase para poder borrarlos si corrigen el error
            
            // Inyectamos el span justo después del input correspondiente
            input.parentNode.insertBefore(spanError, input.nextSibling);
            formularioValido = false;
        };

        // 4a. Validación estricta del Nombre (No puede estar vacío)
        if (inputNombre.value.trim() === '') {
            mostrarError(inputNombre, 'El campo Nombre no puede estar vacío.');
        }

        // 4b. Validación estricta del Email (Debe contener '@' y solo caracteres permitidos)
        // La expresión regular permite letras (mayúsculas y minúsculas), números, arroba, punto y guion bajo.
        const emailRegex = /^[a-zA-Z0-9@._]+$/;
        
        if (inputEmail.value.trim() === '') {
            mostrarError(inputEmail, 'El campo Email no puede estar vacío.');
        } else if (!inputEmail.value.includes('@')) {
            mostrarError(inputEmail, 'El email debe contener obligatoriamente el símbolo "@".');
        } else if (!emailRegex.test(inputEmail.value)) {
            mostrarError(inputEmail, 'El email solo acepta letras, números y los caracteres especiales "." y "_".');
        }

         // Nota: JavaScript diferencia por naturaleza las mayúsculas de minúsculas al leer el 'value'.
        // 4c. Validación estricta del Mensaje (Mínimo 15 y Máximo 400 caracteres)
    const textoMensaje = inputMensaje.value.trim();

    if (textoMensaje === '') {
        mostrarError(inputMensaje, 'El mensaje no puede estar vacío.');
    } else if (textoMensaje.length < 15) {
        mostrarError(inputMensaje, `El mensaje es muy corto. Debe tener al menos 15 caracteres (actualmente tiene ${textoMensaje.length}).`);
    } else if (textoMensaje.length > 400) {
    mostrarError(inputMensaje, `El mensaje no puede superar los 400 caracteres (actualmente tiene ${textoMensaje.length}).`);
    }

        // 5. Feedback Visual Exitoso
        if (formularioValido) {
            // Inyectamos el texto de éxito en el contenedor vacío y le damos color verde
            feedbackContenedor.textContent = '¡Tu consulta fue enviada correctamente!';
            feedbackContenedor.style.color = 'green';
            feedbackContenedor.style.fontWeight = 'bold';
            feedbackContenedor.style.marginTop = '15px';
            
            // Usamos el método reset() para vaciar los inputs del formulario automáticamente
            formulario.reset();
        }
    });
});