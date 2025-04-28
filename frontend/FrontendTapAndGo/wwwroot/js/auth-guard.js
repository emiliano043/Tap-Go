const token = localStorage.getItem("token");
const API_BASE_URL = "http://192.168.1.137:7034/api";

if (!token) {
    window.location.href = "/Login";
} else {
    fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: "Bearer " + token }
    })
        .then(res => {
            if (!res.ok) throw new Error("Token inválido");
            return res.json();
        })
        .then(data => {
            const path = window.location.pathname.toLowerCase();

            if (path.includes("admin") && data.rol !== "admin") {
                alert("Acceso denegado: no eres administrador.");
                window.location.href = "/Cliente";
            }

            if (path.includes("cliente") && data.rol !== "cliente") {
                alert("Acceso denegado: no eres cliente.");
                window.location.href = "/Admin";
            }
        })
        .catch(() => {
            localStorage.removeItem("token");
            window.location.href = "/Login";
        });
}
