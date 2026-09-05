
document.addEventListener('DOMContentLoaded', () => {
    
    const formulario = document.getElementById('formulario-contacto');

    formulario.addEventListener('submit', function(e) {
        
        e.preventDefault(); 

        const inputNombre = document.getElementById('nombre');
        const inputEmail = document.getElementById('email');
        const inputMensaje = document.getElementById('mensaje');
        const feedbackContenedor = document.getElementById('mensaje-feedback');

        document.querySelectorAll('.error-span').forEach(span => span.remove());
        feedbackContenedor.textContent = ''; 

        let formularioValido = true;

        const mostrarError = (input, mensajeTexto) => {
            const spanError = document.createElement('span');
            spanError.textContent = mensajeTexto;
            spanError.style.color = 'red';
            spanError.style.display = 'block';
            spanError.style.fontSize = '0.85rem';
            spanError.style.marginTop = '4px';
            spanError.classList.add('error-span');
            
            input.parentNode.insertBefore(spanError, input.nextSibling);
            formularioValido = false;
        };

        if (inputNombre.value.trim() === '') {
            mostrarError(inputNombre, 'El campo Nombre no puede estar vacío.');
        }

        const emailRegex = /^[a-zA-Z0-9@._]+$/;
        
        if (inputEmail.value.trim() === '') {
            mostrarError(inputEmail, 'El campo Email no puede estar vacío.');
        } else if (!inputEmail.value.includes('@')) {
            mostrarError(inputEmail, 'El email debe contener obligatoriamente el símbolo "@".');
        } else if (!emailRegex.test(inputEmail.value)) {
            mostrarError(inputEmail, 'El email solo acepta letras, números y los caracteres especiales "." y "_".');
        }

    const textoMensaje = inputMensaje.value.trim();

    if (textoMensaje === '') {
        mostrarError(inputMensaje, 'El mensaje no puede estar vacío.');
    } else if (textoMensaje.length < 15) {
        mostrarError(inputMensaje, `El mensaje es muy corto. Debe tener al menos 15 caracteres (actualmente tiene ${textoMensaje.length}).`);
    } else if (textoMensaje.length > 400) {
    mostrarError(inputMensaje, `El mensaje no puede superar los 400 caracteres (actualmente tiene ${textoMensaje.length}).`);
    }

        if (formularioValido) {
            feedbackContenedor.textContent = '¡Tu consulta fue enviada correctamente!';
            feedbackContenedor.style.color = 'green';
            feedbackContenedor.style.fontWeight = 'bold';
            feedbackContenedor.style.marginTop = '15px';            
            formulario.reset();
        }
    });
});