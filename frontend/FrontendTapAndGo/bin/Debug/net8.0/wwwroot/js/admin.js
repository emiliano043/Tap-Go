document.addEventListener("DOMContentLoaded", () => {
const token = localStorage.getItem("token_admin");
    if (!token) location.href = "/Login";


    //  Todos los usuarios (admin)
    fetch("http://a79ae1b393e2246f5813f8c16a8028b9-123841045.us-east-1.elb.amazonaws.com/api/auth/users", {
        headers: { Authorization: "Bearer " + token }
    })
        .then(res => {
            if (!res.ok) throw new Error("Fallo la autenticación");
            return res.json();
        })
        .then(usuarios => {
            const contenedor = document.getElementById("tabla-usuarios");

            // Encabezados
            let tablaHTML = `
        <h2>Usuarios registrados</h2>
        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                </tr>
            </thead>
            <tbody>
    `;

            // Filas
            usuarios.forEach(user => {
                tablaHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name || "(sin nombre)"}</td>
                <td>${user.email}</td>
                <td>${user.rol}</td>
            </tr>
        `;
            });

            tablaHTML += `
            </tbody>
        </table>
    `;

            contenedor.innerHTML = tablaHTML;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("tabla-usuarios").innerHTML = "<p>Error al cargar los usuarios</p>";
        });

    apiGet("/menu", token).then(productos => {
        const div = document.getElementById("tabla-productos");

        let tablaHTML = `
        <h2>Productos del Menú</h2>
        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Stock</th>
                    <th>Calorías</th>
                    <th>Precio Chico</th>
                    <th>Precio Mediano</th>
                    <th>Precio Grande</th>
                </tr>
            </thead>
            <tbody>
    `;

        productos.forEach(p => {
            tablaHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${p.tipo || "-"}</td>
                <td>${p.stock}</td>
                <td>${p.calorias}</td>
                <td>$${p.precioChico}</td>
                <td>$${p.precioMediano}</td>
                <td>$${p.precioGrande}</td>
            </tr>
        `;
        });

        tablaHTML += `
            </tbody>
        </table>
    `;

        div.innerHTML = tablaHTML;
    });

});
