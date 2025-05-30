﻿const carritoHelper = (function () {

    function getCarritoKey() {
        const clienteId = localStorage.getItem("clienteId");
        return clienteId ? `carrito_${clienteId}` : null;
    }

    function cargarCarrito() {
        const carritoKey = getCarritoKey();
        if (!carritoKey) return {};
        return JSON.parse(localStorage.getItem(carritoKey)) || {};
    }

    function guardarCarrito(carrito) {
        const carritoKey = getCarritoKey();
        if (!carritoKey) return;
        localStorage.setItem(carritoKey, JSON.stringify(carrito));
    }

    function agregarProducto(id, producto) {
        const carrito = cargarCarrito();
        carrito[id] = producto;
        guardarCarrito(carrito);
    }

    function eliminarProducto(id) {
        const carrito = cargarCarrito();
        delete carrito[id];
        guardarCarrito(carrito);
    }


    function calcularTotal() {
        const carrito = cargarCarrito();
        return Object.values(carrito).reduce((total, item) => total + (item.precioUnidad * item.cantidad), 0);
    }

    async function confirmarCompra() {
        const carrito = cargarCarrito();

        if (Object.keys(carrito).length === 0) {
            Swal.fire("Error", "Tu carrito está vacío.", "error");
            return;
        }

        const clienteNombre = localStorage.getItem("clienteNombre");
        if (!clienteNombre) {
            Swal.fire("Error", "No se encontró el cliente. Inicie sesión de nuevo.", "error");
            return;
        }

        const detalles = [];

        try {
<<<<<<< HEAD
            const resMenu = await fetch("af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api/menu");
=======
            const resMenu = await fetch("http://a79ae1b393e2246f5813f8c16a8028b9-123841045.us-east-1.elb.amazonaws.com/api/menu");
>>>>>>> edcf0f03e512ea134731019dbc2e87f0b386082e
            const menuItems = await resMenu.json();

            for (const itemCarrito of Object.values(carrito)) {
                const producto = menuItems.find(p => p.nombre === itemCarrito.nombre);

                if (!producto) {
                    Swal.fire("Error", `Producto no encontrado: ${itemCarrito.nombre}`, "error");
                    return;
                }

                detalles.push({
                    menuItemId: producto.id,
                    cantidad: itemCarrito.cantidad,
                    tamano: itemCarrito.tamaño.split(' ')[0].toLowerCase()
                        .replace('pequeño', 'chico')
                        .replace('mediano', 'mediano')
                        .replace('grande', 'grande')
                });
            }

            const pedido = {
                cliente: clienteNombre,
                detalles: detalles
            };

            const token = localStorage.getItem('token_cliente');

<<<<<<< HEAD
            const resPedido = await fetch("af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api/pedidos", {
=======
            const resPedido = await fetch("http://a79ae1b393e2246f5813f8c16a8028b9-123841045.us-east-1.elb.amazonaws.com/api/pedidos", {
>>>>>>> edcf0f03e512ea134731019dbc2e87f0b386082e
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(pedido)
            });

            if (!resPedido.ok) {
                const error = await resPedido.text();
                throw new Error(error);
            }

            const data = await resPedido.json();

            Swal.fire({
                title: "¡Pedido realizado!",
                text: `Total: $${data.total.toFixed(2)}\nFecha: ${new Date(data.fecha).toLocaleString()}`,
                icon: "success"
            }).then(() => {
                const metodoPago = localStorage.getItem("metodoPago");
                if (metodoPago === "efectivo") {
                    window.location.href = "/PagoEfectivo";
                } else if (metodoPago === "tarjeta") {
                    window.location.href = "/PagoTarjeta";
                } else {
                    window.location.href = "/Inicio"; // fallback por si no se eligió nada
                }
            });


        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.message, "error");
        }
    }

    // Exponer las funciones
    return {
        agregarProducto,
        eliminarProducto,
        cargarCarrito,
        guardarCarrito,
        calcularTotal,
        confirmarCompra
    };
})();
