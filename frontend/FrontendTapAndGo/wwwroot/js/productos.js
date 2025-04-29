document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    cargarProductos();

    document.getElementById("formProducto").addEventListener("submit", async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById("form-error");
        errorDiv.innerText = "";

        const producto = {
            nombre: nombre.value.trim(),
            categoria: categoria.value.trim(),
            tipo: tipo.value.trim(),
            descripcion: descripcion.value.trim(),
            imagen: imagen.value.trim(),
            stock: parseFloat(stock.value),
            calorias: parseFloat(calorias.value),
            precioChico: parseFloat(precioChico.value),
            precioMediano: parseFloat(precioMediano.value),
            precioGrande: parseFloat(precioGrande.value)
        };

        // Validación básica
        if (!producto.nombre || !producto.categoria || !producto.tipo || isNaN(producto.precioChico)) {
            errorDiv.innerText = "Por favor completa todos los campos obligatorios.";
            return;
        }

        const id = document.getElementById("productoId").value;
        const url = id
            ? `http://localhost:7034/menu/${id}`
            : "http://localhost:7034/api/menu";
        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(producto)
        });

        if (res.ok) {
            Swal.fire({
                title: id ? "Producto actualizado" : "Producto agregado",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: "top-end"
            });
            document.getElementById("formProducto").reset();
            document.getElementById("productoId").value = "";
            document.getElementById("btnGuardar").innerText = "Agregar Producto";
            cargarProductos();
        } else {
            errorDiv.innerText = "Error al guardar el producto.";
        }
    });
});

async function cargarProductos() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:7034/api/menu", {
        headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();

    const div = document.getElementById("tabla-productos");
    div.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Precio Mediano</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(p => `
                    <tr>
                        <td>${p.nombre}</td>
                        <td>${p.categoria}</td>
                        <td>${p.tipo}</td>
                        <td>$${p.precioMediano}</td>
                        <td>
                            <button onclick="editarProducto(${p.id})">Editar</button>
                            <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

async function eliminarProducto(id) {
    const token = localStorage.getItem("token");
    if (!confirm("¿Deseas eliminar este producto?")) return;

    const res = await fetch(`http://localhost:7034/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    });

    if (res.ok) {
        Swal.fire("Success", "Producto eliminado.", "success")
        cargarProductos();
    } else {
        Swal.fire("Error", "Error al eliminar producto.", "error")
    }
}

async function editarProducto(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:7034/api/menu`, {
        headers: { Authorization: "Bearer " + token }
    });
    const productos = await res.json();
    const producto = productos.find(p => p.id === id);
    if (!producto) return Swal.fire("Error", "Producto no encontrado.", "error")

    // Rellenar formulario
    nombre.value = producto.nombre;
    categoria.value = producto.categoria;
    tipo.value = producto.tipo;
    descripcion.value = producto.descripcion;
    imagen.value = producto.imagen;
    stock.value = producto.stock;
    calorias.value = producto.calorias;
    precioChico.value = producto.precioChico;
    precioMediano.value = producto.precioMediano;
    precioGrande.value = producto.precioGrande;
    productoId.value = producto.id;
    btnGuardar.innerText = "Actualizar Producto";
}
