document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const API_BASE_URL = "http://192.168.1.137:7034/api";

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
    localStorage.setItem("token", data.token);

    // Obtener el rol del usuario
    const me = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: "Bearer " + data.token }
    }).then(r => r.json());

    if (me.rol === "admin") {
        window.location.href = "/Admin";
    } else if (me.rol === "cocina") {
        window.location.href = "/Cocina";
    } else {
        window.location.href = "/Cliente";
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/Login";
}
