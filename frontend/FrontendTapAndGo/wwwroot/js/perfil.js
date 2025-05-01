document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cambiarPasswordForm");

    if (!form) {
        console.error("Formulario no encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const actual = document.getElementById("passwordActual").value;
        const nueva = document.getElementById("nuevaPassword").value;
        const confirmar = document.getElementById("confirmarPassword").value;

        if (nueva !== confirmar) {
            Swal.fire({
                icon: "warning",
                title: "Las contraseñas no coinciden",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        const res = await fetch("http://localhost:31245/api/auth/me/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                passwordActual: actual,
                nuevaPassword: nueva
            })
        });

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                timer: 2000,
                showConfirmButton: false
            });
            form.reset();
        } else {
            const msg = await res.text();
            Swal.fire({
                icon: "error",
                title: "Error al cambiar contraseña",
                text: msg || "Verifica tus datos e intenta nuevamente"
            });
        }
    });
});
