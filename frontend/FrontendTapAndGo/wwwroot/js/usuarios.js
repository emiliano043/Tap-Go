document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    cargarUsuarios();

    document.getElementById("formUsuario").addEventListener("submit", async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById("form-usuario-error");
        errorDiv.innerText = "";

        const user = {
            email: email.value.trim(),
            rol: rol.value,
            name: nombre.value.trim()
        };

        if (!user.email || !user.rol) {
            errorDiv.innerText = "Correo y rol son obligatorios.";
            return;
        }

        const id = usuarioId.value;
        const url = id
            ? `http://192.168.1.137:7034/api/auth/users/${id}`
            : `http://192.168.1.137:7034/api/auth/register`;
        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(user)
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: id ? "Usuario actualizado" : "Usuario creado",
                timer: 2000,
                showConfirmButton: false
            });
            formUsuario.reset();
            usuarioId.value = "";
            btnGuardarUsuario.innerText = "Agregar Usuario";
            cargarUsuarios();
        } else {
            const msg = await res.text();
            errorDiv.innerText = msg || "Error al guardar el usuario.";
        }
    });
});

async function cargarUsuarios() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://192.168.1.137:7034/api/auth/users", {
        headers: { Authorization: "Bearer " + token }
    });
    const usuarios = await res.json();

    const tabla = document.getElementById("tabla-usuarios");
    tabla.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Nombre</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${usuarios.map(u => `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.email}</td>
                        <td>${u.rol}</td>
                        <td>${u.name ?? "-"}</td>
                        <td>
                            <button onclick="editarUsuario(${u.id})">Editar</button>
                            ${u.rol === "admin" ? `<span style="color: gray;">No editable</span>` :
            `<button onclick="eliminarUsuario(${u.id}, '${u.email}')">Eliminar</button>`}
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

async function eliminarUsuario(id, email) {
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: `Eliminarás al usuario ${email}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`http://192.168.1.137:7034/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    });

    if (res.ok) {
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        cargarUsuarios();
    } else {
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
    }
}


async function editarUsuario(id) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://192.168.1.137:7034/api/auth/users", {
        headers: { Authorization: "Bearer " + token }
    });
    const usuarios = await res.json();
    const user = usuarios.find(u => u.id === id);
    if (!user) return Swal.fire("Error", "Usuario no encontrado.", "error");

    email.value = user.email;
    rol.value = user.rol;
    nombre.value = user.name ?? "";
    usuarioId.value = user.id;
    btnGuardarUsuario.innerText = "Actualizar Usuario";
}
