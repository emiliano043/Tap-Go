document.addEventListener("DOMContentLoaded", function () {
    renderizarCarrito();
});

function getCarritoKey() {
    const clienteId = localStorage.getItem("clienteId");
    return clienteId ? `carrito_${clienteId}` : null;
}

function renderizarCarrito() {
    const carritoKey = getCarritoKey();
    if (!carritoKey) return;

    const carrito = JSON.parse(localStorage.getItem(carritoKey)) || {};
    const contenedor = document.getElementById("contenedor-carrito");
    contenedor.innerHTML = "";

    let total = 0;

    if (Object.keys(carrito).length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        document.getElementById("total-carrito").innerText = "Total: $0.00";
        return;
    }

    for (const [id, item] of Object.entries(carrito)) {
        const subtotal = item.precioUnidad * item.cantidad;
        total += subtotal;

        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-carrito');
        productoDiv.innerHTML = `
            <p><strong>${item.nombre}</strong> (${item.tamaño})</p>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio Unitario: $${item.precioUnidad.toFixed(2)}</p>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <button onclick="eliminarProducto('${id}')">Eliminar</button>
        `;
        contenedor.appendChild(productoDiv);
    }

    document.getElementById("total-carrito").innerText = `Total: $${total.toFixed(2)}`;
}

function eliminarProducto(id) {
    const carritoKey = getCarritoKey();
    if (!carritoKey) return;

    const carrito = JSON.parse(localStorage.getItem(carritoKey)) || {};
    delete carrito[id];
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
    renderizarCarrito();
}

