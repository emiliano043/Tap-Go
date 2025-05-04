document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();

        if (!nombre) {
            document.getElementById('error').innerText = "Por favor ingrese su nombre.";
            return;
        }

        try {
            const API_URL = "af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api/auth/cliente"; 

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const data = await response.json();

            // Guardar en localStorage
            localStorage.setItem("token_cliente", data.token);
            localStorage.setItem("clienteId", data.id);
            localStorage.setItem("clienteNombre", data.nombre);
            localStorage.setItem("clienteFechaRegistro", data.fechaRegistro);

            // Redirigir
            window.location.href = "/MetodoPago";
        } catch (error) {
            document.getElementById('error').innerText = "Error: " + error.message;
            console.error("Error al registrar cliente:", error);
        }
    });
});
