document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function (e) {
    e.preventDefault(); // Evitar que se mande directo el enlace

Swal.fire({
    title: "¿Cerrar sesión?",
text: "¿Seguro que quieres salir?",
icon: "warning",
showCancelButton: true,
confirmButtonText: "Sí, salir",
cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
    localStorage.removeItem("token"); // Eliminar token
window.location.href = "/Login"; // Redirigir
            }
        });
    });
});
