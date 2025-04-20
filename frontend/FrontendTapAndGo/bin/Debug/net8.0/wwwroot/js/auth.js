document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) location.href = "/Login";

    // Cargar pedidos
    fetch("http://192.168.1.137:7034/api/pedidos", {
        headers: { Authorization: "Bearer " + token }
    })
        .then(res => res.json())
        .then(pedidos => {
            // Ordenarlos por hora (más recientes primero)
            pedidos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            renderPedidos(pedidos);
        })
        .catch(err => {
            console.error("Error al cargar pedidos:", err);
        });
});

function renderPedidos(pedidos) {
    const container = document.getElementById("pedidos-container");
    container.innerHTML = pedidos.map(p => `
        <div class="pedido">
            <p><strong>Cliente:</strong> ${p.cliente}</p>
            <p><strong>Hora:</strong> ${new Date(p.fecha).toLocaleTimeString()}</p>
            <p><strong>Total:</strong> $${p.total.toFixed(2)}</p>
            <ul>
                ${p.detalles.map(d => `<li>${d.cantidad} x ${d.nombre} (${d.tamano})</li>`).join("")}
            </ul>
            <select onchange="actualizarEstado(${p.id}, this.value)">
                <option value="">Estado</option>
                <option value="en proceso">En proceso</option>
                <option value="listo">Listo</option>
                <option value="10 min">10 min</option>
                <option value="15 min">15 min</option>
            </select>
        </div>
    `).join("");
}

function actualizarEstado(id, estado) {
    Swal.fire({
        icon: "info",
        title: `Pedido #${id}`,
        text: `Nuevo estado: ${estado}`,
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false
    });

    if (sonidoActivado) {
        sonidoNuevoPedido.play();
    }

    // Aquí deberías mandar el PUT a la API para actualizar el estado
    // Por ahora simula la actualización:
    cargarPedidos(); // Luego de actualizar realmente el estado
}

// ✅ Variables globales para sonido y pedidos previos
let sonidoActivado = false;
let pedidosAnteriores = [];

const carrusel = document.getElementById("neonCarrusel");
const API_URL = "http://192.168.1.137:7034/api/pedidos";
const sonidoNuevoPedido = new Audio("/sounds/new-order.mp3");

// Botón de activación de sonido
Swal.fire({
    title: "¿Activar sonido de pedidos?",
    text: "Esto permitirá reproducir alertas cuando lleguen nuevos pedidos.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Activar",
    cancelButtonText: "No por ahora"
}).then(result => {
    if (result.isConfirmed) {
        sonidoActivado = true;
    }
});

// Función principal para actualizar carrusel
async function actualizarCarrusel() {
    const token = localStorage.getItem("token");
    const res = await fetch(API_URL, {
        headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) return;

    const pedidos = await res.json();
    const activos = pedidos.filter(p => p.estado === "en proceso" || p.estado === "tiempo estimado");

    // Generar texto del carrusel
    const texto = activos.map(p =>
        p.detalles.map(d => `${d.nombre} ${d.tamano}`).join(" --- ")
    ).join(" --- ");

    carrusel.textContent = texto || "Sin pedidos en cola";

    // Verificar si hay nuevos pedidos
    const idsActuales = activos.map(p => p.id);
    const nuevosPedidos = idsActuales.filter(id => !pedidosAnteriores.includes(id));

    if (nuevosPedidos.length > 0 && sonidoActivado) {
        sonidoNuevoPedido.play();
    }

    pedidosAnteriores = idsActuales;
}

// Repetir cada 10 segundos
setInterval(actualizarCarrusel, 10000);
actualizarCarrusel();
