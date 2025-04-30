document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token_admin");
    cargarUsuarios();

    document.getElementById("formUsuario").addEventListener("submit", async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById("form-usuario-error");
        errorDiv.innerText = "";

        const emailInput = document.getElementById("email");
        const rolSelect = document.getElementById("rol");
        const nombreInput = document.getElementById("nombre");
        const passwordInput = document.getElementById("passwordHash");

        const user = {
            email: emailInput.value.trim(),
            rol: rolSelect.value,
            name: nombreInput.value.trim(),
            passwordHash: passwordInput.value.trim()
        };


        if (!user.email || !user.rol) {
            errorDiv.innerText = "Correo y rol son obligatorios.";
            return;
        }

        const id = usuarioId.value;
        const url = id
            ? `http://localhost:7034/api/auth/users/${id}`
            : `http://localhost:7034/api/auth/register`;
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
    const token = localStorage.getItem("token_admin");
    const res = await fetch("http://localhost:7034/api/auth/users", {
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
    const token = localStorage.getItem("token_admin");

    const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: `Eliminarás al usuario ${email}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`http://localhost:7034/api/auth/users/${id}`, {
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
    const token = localStorage.getItem("token_admin");
    const res = await fetch("http://localhost:7034/api/auth/users", {
        headers: { Authorization: "Bearer " + token }
    });
    const usuarios = await res.json();
    const user = usuarios.find(u => u.id === id);
    if (!user) return Swal.fire("Error", "Usuario no encontrado.", "error");

    document.getElementById("email").value = user.email;
    document.getElementById("rol").value = user.rol;
    document.getElementById("nombre").value = user.name ?? "";
    document.getElementById("passwordHash").value = ""; // siempre vacío
    usuarioId.value = user.id;
    btnGuardarUsuario.innerText = "Actualizar Usuario";
}
