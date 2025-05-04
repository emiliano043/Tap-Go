document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const API_BASE_URL = "http://af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api";

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, passwordHash: password })
            });

            if (!res.ok) {
                document.getElementById('error').innerText = "Credenciales incorrectas";
                return;
            }

            const data = await res.json();

            // Obtener información del usuario (nombre, rol, etc.)
            const me = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: "Bearer " + data.token }
            }).then(r => r.json());

            // Guardar token específico según rol
            if (me.rol === "admin") {
                localStorage.setItem("token_admin", data.token);
                window.location.href = "/Admin";
            } else if (me.rol === "cocina") {
                localStorage.setItem("token_cocina", data.token);
                window.location.href = "/Cocina";
            } else if (me.rol === "mesero") {
                localStorage.setItem("token_mesero", data.token);
                window.location.href = "/Mesero";
            } else {
                Swal.fire("Error", "Rol no autorizado", "error");
                return;
            }

            // Datos adicionales opcionales
            localStorage.setItem("usuarioNombre", me.nombre);
            localStorage.setItem("usuarioEmail", me.email);
            localStorage.setItem("usuarioRol", me.rol);

        } catch (error) {
            console.error("Error durante login:", error);
            Swal.fire("Error", "Ocurrió un error inesperado", "error");
        }
    });
});
