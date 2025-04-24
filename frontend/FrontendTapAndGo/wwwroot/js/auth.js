const API_BASE_URL = "https://8296-2806-106e-20-37c2-fcae-1901-6419-f307.ngrok-free.app/api";


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');
    const errorElement = document.getElementById('error');
    let hasConfirmedNgrok = false;

    // Función para confirmar ngrok
    const confirmNgrok = () => {
        const ngrokUrl = "https://8296-2806-106e-20-37c2-fcae-1901-6419-f307.ngrok-free.app";
        window.open(ngrokUrl, '_blank');
        hasConfirmedNgrok = true;
        errorElement.innerText = "Se ha abierto una nueva pestaña para confirmar ngrok. Por favor, haz clic en 'Visit Site' en esa pestaña y luego intenta iniciar sesión nuevamente.";
    };

    // Añadir botón de confirmación ngrok después del formulario
    const confirmBtn = document.createElement('button');
    confirmBtn.innerText = "Confirmar acceso a ngrok";
    confirmBtn.classList.add('btn', 'btn-secondary', 'mt-2');
    confirmBtn.onclick = (e) => {
        e.preventDefault();
        confirmNgrok();
    };
    form.after(confirmBtn);

    form.onsubmit = async (e) => {
        e.preventDefault();
        errorElement.innerText = ""; // Limpiar mensajes de error previos

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const API_BASE_URL = "https://8296-2806-106e-20-37c2-fcae-1901-6419-f307.ngrok-free.app/api";

        try {
            // Primer intento: Login
            const res = await fetch(`${API_BASE_URL}/Auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    passwordHash: password
                })
                // Sin credentials: 'include' para evitar problemas CORS
            });

            // Verificar si la respuesta del login es HTML (página de ngrok)
            const loginContentType = res.headers.get("content-type");
            if (loginContentType && loginContentType.includes("text/html")) {
                if (!hasConfirmedNgrok) {
                    confirmNgrok();
                    return;
                }
                throw new Error("Aún recibiendo página HTML de ngrok. Por favor asegúrate de confirmar el acceso en la nueva pestaña y espera unos segundos.");
            }

            if (!res.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            // Segunda petición: Obtener información del usuario
            const meRes = await fetch(`${API_BASE_URL}/Auth/me`, {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
                // Sin credentials: 'include'
            });

            // Verificar si la respuesta del /me es HTML (página de ngrok)
            const meContentType = meRes.headers.get("content-type");
            if (meContentType && meContentType.includes("text/html")) {
                if (!hasConfirmedNgrok) {
                    confirmNgrok();
                    return;
                }
                throw new Error("Aún recibiendo página HTML de ngrok. Por favor asegúrate de confirmar el acceso en la nueva pestaña y espera unos segundos.");
            }

            if (!meRes.ok) {
                throw new Error("Error al obtener información del usuario");
            }

            try {
                const me = await meRes.json();
                const role = me.rol;

                // Redireccionar según el rol
                if (role === "admin") {
                    window.location.href = "/Admin";
                } else if (role === "cocina") {
                    window.location.href = "/Cocina";
                } else {
                    window.location.href = "/Cliente";
                }
            } catch (jsonErr) {
                console.error("Error al procesar JSON:", jsonErr);
                throw new Error("No se pudo procesar la respuesta del servidor. Posiblemente el formato no es JSON válido.");
            }
        } catch (err) {
            console.error("Error:", err);
            errorElement.innerText = `Error: ${err.message}`;
            errorElement.classList.add("text-danger");
        }
    };

    // Verificar si ya hay sesión activa
    const checkExistingSession = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const meRes = await fetch(`${API_BASE_URL}/Auth/me`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            });

            // Si hay página de confirmación, mostrar botón
            const contentType = meRes.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                confirmBtn.style.display = "block";
                return;
            }

            if (!meRes.ok) {
                // Token inválido o expirado
                localStorage.removeItem("token");
                return;
            }

            const me = await meRes.json();
            // Redireccionar si ya hay sesión válida
            if (me && me.rol) {
                if (me.rol === "admin") {
                    window.location.href = "/Admin";
                } else if (me.rol === "cocina") {
                    window.location.href = "/Cocina";
                } else {
                    window.location.href = "/Cliente";
                }
            }
        } catch (err) {
            console.warn("Error al verificar sesión:", err);
            // No hacemos nada, simplemente dejamos que el usuario inicie sesión
        }
    };

    // Ocultar el botón por defecto hasta que sea necesario
    confirmBtn.style.display = "none";

    // Verificar sesión al cargar la página
    checkExistingSession();
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/Login";
}