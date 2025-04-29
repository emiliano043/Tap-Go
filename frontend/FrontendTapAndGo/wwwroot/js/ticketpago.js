document.addEventListener("DOMContentLoaded", function () {
    cargarTicketPago();
});

async function cargarTicketPago() {
    const clienteId = localStorage.getItem("clienteId");
    const clienteNombre = localStorage.getItem("clienteNombre");
    const metodoPago = localStorage.getItem("metodoPago");

    if (!clienteId || !clienteNombre) {
        Swal.fire("Error", "Información del cliente no disponible. Redirigiendo...", "error")
            .then(() => window.location.href = "/MetodoPago");
        return;
    }

    document.getElementById("idCliente").innerText = clienteId;
    document.getElementById("nombreCliente").innerText = clienteNombre;

    // Obtener carrito del cliente
    const carritoKey = `carrito_${clienteId}`;
    const carrito = JSON.parse(localStorage.getItem(carritoKey)) || {};

    if (Object.keys(carrito).length === 0) {
        document.getElementById("detalleProductos").innerHTML = "<tr><td colspan='4'>Carrito vacío.</td></tr>";
        document.getElementById("totalPago").innerText = "0.00";
        return;
    }

    let total = 0;
    const detalleProductos = document.getElementById("detalleProductos");
    detalleProductos.innerHTML = "";

    for (const item of Object.values(carrito)) {
        const subtotal = item.precioUnidad * item.cantidad;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.tamaño}</td>
            <td>$${subtotal.toFixed(2)}</td>
        `;
        detalleProductos.appendChild(row);
    }

    document.getElementById("totalPago").innerText = total.toFixed(2);

    // (Opcional) limpiar 
    localStorage.removeItem("metodoPago");
    localStorage.removeItem(`carrito_${clienteId}`);

}
