let sonidoActivado = false;
let pedidosAnteriores = [];
let carrusel = null; 
let firmaAnterior = [];

const API_URL = "http://localhost:31245/api/pedidos";
const sonidoNuevoPedido = new Audio("/sound/ding.mp3");

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token_cocina");
    if (!token) location.href = "/Login";

    carrusel = document.getElementById("neonCarrusel"); 

    cargarPedidos();
    activarSonidoInicial();
    setInterval(actualizarCarrusel, 10000);
});

function cargarPedidos() {
    const token = localStorage.getItem("token_cocina");
    fetch("http://localhost:31245/api/pedidos", {
        headers: { Authorization: "Bearer " + token }
    })
        .then(res => res.json())
        .then(pedidos => {
            pedidos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            renderPedidos(pedidos);
        })
        .catch(err => {
            console.error("Error al cargar pedidos:", err);
        });
}

function renderPedidos(pedidos) {
    // Ocultar pedidos entregados
    pedidos = pedidos.filter(p => p.estado !== "entregado");

    const container = document.getElementById("pedidos-container");
    document.getElementById("contador-pedidos").textContent = `(${pedidos.length})`;

    container.innerHTML = pedidos.map(p => {
        let claseEstado = "";
        if (p.estado === "en proceso") claseEstado = "estado-en-proceso";
        else if (p.estado === "listo") claseEstado = "estado-listo";
        else if (p.estado?.includes("min")) claseEstado = "estado-tiempo";

        return `
            <div class="pedido ${claseEstado}">
                <p><strong>Cliente:</strong> ${p.cliente}</p>
                <p><strong>Hora:</strong> ${new Date(p.fecha).toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
                <p><strong>Total:</strong> $${p.total.toFixed(2)}</p>
                <ul>
                    ${p.detalles.map(d => `<li>${d.cantidad} x ${d.nombre} (${d.tamano})</li>`).join("")}
                </ul>
                <select onchange="actualizarEstado(${p.id}, this.value)">
                    <option value="">Estado</option>
                    <option value="en proceso" ${p.estado === "en proceso" ? "selected" : ""}>En proceso</option>
                    <option value="listo" ${p.estado === "listo" ? "selected" : ""}>Listo</option>
                    <option value="10 min" ${p.estado === "10 min" ? "selected" : ""}>10 min</option>
                    <option value="15 min" ${p.estado === "15 min" ? "selected" : ""}>15 min</option>
                </select>

                <button onclick="marcarEntregado(${p.id})" class="btn-entregar">Entregar</button>
            </div>
        `;
    }).join("");
}
function actualizarEstado(id, estado) {
    const token = localStorage.getItem("token_cocina");

    fetch(`http://localhost:31245/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ estado })
    })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo actualizar el estado");
            // Solo intento leer JSON si el código no es 204
            return res.status !== 204 ? res.json() : null;
        })

        .then(() => {
            Swal.fire({
                icon: "success",
                title: `Pedido #${id}`,
                text: `Estado actualizado a: ${estado}`,
                toast: true,
                position: "top-end",
                timer: 2000,
                showConfirmButton: false
            });

            cargarPedidos();
        })
        .catch(err => {
            console.error("Error actualizando estado:", err);
            Swal.fire("Error", "No se pudo actualizar el estado del pedido", "error");
        });
}


function activarSonidoInicial() {
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
            document.getElementById("toggle-sonido").style.display = "inline-block";
        }
    });

    document.getElementById("activar-sonido").addEventListener("click", () => {
        sonidoActivado = true;
        Swal.fire("Sonido activado", "Se reproducirá un sonido con cada nuevo pedido.", "success");
    });

    document.getElementById("toggle-sonido").addEventListener("click", () => {
        sonidoActivado = !sonidoActivado;
        Swal.fire(sonidoActivado ? "Sonido activado" : "Sonido silenciado", "", "info");
    });
}

async function actualizarCarrusel() {
    const token = localStorage.getItem("token_cocina");
    const res = await fetch(API_URL, {
        headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) return;

    const pedidos = await res.json();
    const activos = pedidos.filter(p => p.estado === "en proceso" || p.estado === "tiempo estimado");

    const texto = activos.map(p =>
        p.detalles.map(d => `${d.cantidad} x ${d.nombre} ${d.tamano}`).join(" --- ")
    ).join(" --- ");


    carrusel.textContent = texto || "Sin pedidos en cola";

    const nuevaFirma = activos.map(p => `${p.id}-${p.estado}`);
    const hayCambio = nuevaFirma.some(f => !firmaAnterior.includes(f));

    if (hayCambio && sonidoActivado) {
        sonidoNuevoPedido.play();
    }

    firmaAnterior = nuevaFirma;
    renderPedidos(pedidos); // Actualiza tarjetas también
}

    function marcarEntregado(id) {
    const token = localStorage.getItem("token_cocina");

        fetch(`http://localhost:31245/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ estado: "entregado" })
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo marcar como entregado");
        return res.status !== 204 ? res.json() : null;
    })
    .then(() => {
        Swal.fire({
            icon: "success",
            title: `Pedido #${id}`,
            text: "Pedido entregado",
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false
        });
        cargarPedidos();
    })
    .catch(err => {
        console.error("Error al entregar pedido:", err);
        Swal.fire("Error", "No se pudo marcar como entregado", "error");
    });
}
