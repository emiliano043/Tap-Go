const API_BASE_URL = "af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api";

// Detectar el rol actual
const rol = localStorage.getItem("usuarioRol");

// Determinar qué token usar según el rol
let token = null;
if (rol === "admin") token = localStorage.getItem("token_admin");
else if (rol === "cocina") token = localStorage.getItem("token_cocina");
else if (rol === "mesero") token = localStorage.getItem("token_mesero");
else if (rol === "cliente") token = localStorage.getItem("token_cliente");

// Si no hay token → redirige
if (!token) {
    window.location.href = "/Login";
} else {
    // Validar el token en la API
    fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: "Bearer " + token }
    })
        .then(res => {
            if (!res.ok) throw new Error("Token inválido");
            return res.json();
        })
        .then(data => {
            if (data.rol !== rol) {
                alert(`Acceso denegado: tu rol es ${data.rol}, pero esta vista espera ${rol}.`);
                window.location.href = "/Login";
            }
        })
        .catch(() => {
            localStorage.removeItem(`token_${rol}`);
            localStorage.removeItem("usuarioRol");
            window.location.href = "/Login";
        });
}
