document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "http://a79ae1b393e2246f5813f8c16a8028b9-123841045.us-east-1.elb.amazonaws.com/api/menu";

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener el menú.");

        const productos = await res.json();

        const complementos = productos.filter(p => p.tipo.toLowerCase() === "complemento");

        const categorias = [...new Set(complementos.map(a => a.categoria))];
        const contenedor = document.getElementById('contenedor-complementos');

        categorias.forEach(categoria => {
            const bloqueCategoria = document.createElement('div');
            bloqueCategoria.classList.add('categoria-bloque');
            bloqueCategoria.innerHTML = `<h2 class="titulo-categoria">${categoria}</h2>`;

            const carrusel = document.createElement('div');
            carrusel.classList.add('carrusel');

            complementos.filter(a => a.categoria === categoria).forEach(item => {
                const id = crypto.randomUUID();

                carrusel.innerHTML += `
                    <div class="producto" data-id="${id}" data-nombre="${item.nombre}" data-precio-chico="${item.precioChico}" data-precio-mediano="${item.precioMediano}" data-precio-grande="${item.precioGrande}">
                        <img src="${item.imagen}" alt="${item.nombre}" />
                        <p>${item.nombre}</p>

                        <select onchange="actualizarPrecio('${id}')">
                            <option value="chico">Pequeño</option>
                            <option value="mediano" selected>Mediano</option>
                            <option value="grande">Grande</option>
                        </select>

                        <span class="precio" id="precio-${id}">$${item.precioMediano}</span>

                        <div class="contador">
                            <button onclick="cambiarCantidad('${id}', -1)">–</button>
                            <span id="cantidad-${id}">0</span>
                            <button onclick="cambiarCantidad('${id}', 1)">+</button>
                        </div>
                    </div>
                `;
            });

            bloqueCategoria.appendChild(carrusel);
            contenedor.appendChild(bloqueCategoria);
        });

    } catch (error) {
        console.error(error);
        document.getElementById('contenedor-complementos').innerHTML = "<p>Error al cargar productos.</p>";
    }
});

function actualizarPrecio(id) {
    const producto = document.querySelector(`.producto[data-id="${id}"]`);
    const select = producto.querySelector('select').value;

    let precio = parseFloat(producto.dataset.precioMediano);
    if (select === "chico") precio = parseFloat(producto.dataset.precioChico);
    else if (select === "grande") precio = parseFloat(producto.dataset.precioGrande);

    document.getElementById(`precio-${id}`).innerText = `$${precio.toFixed(2)}`;
    actualizarCarrito(id);
}

function cambiarCantidad(id, cambio) {
    const cantidadSpan = document.getElementById(`cantidad-${id}`);
    let cantidad = parseInt(cantidadSpan.innerText);

    cantidad += cambio;
    if (cantidad < 0) cantidad = 0;

    cantidadSpan.innerText = cantidad;
    actualizarCarrito(id);
}

function actualizarCarrito(id) {
    const producto = document.querySelector(`.producto[data-id="${id}"]`);
    const nombre = producto.dataset.nombre;
    const select = producto.querySelector('select').value;
    const tamaño = (select === "chico") ? "Pequeño" : (select === "mediano") ? "Mediano" : "Grande";
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).innerText);
    const precioTexto = document.getElementById(`precio-${id}`).innerText.replace('$', '');
    const precioUnidad = parseFloat(precioTexto);

    if (cantidad <= 0) {
        carritoHelper.eliminarProducto(id);
        return;
    }

    carritoHelper.agregarProducto(id, {
        nombre: nombre,
        cantidad: cantidad,
        tamaño: tamaño,
        precioUnidad: precioUnidad
    });
}
