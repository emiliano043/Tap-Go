document.addEventListener("DOMContentLoaded", () => {
    const iconoNotif = document.getElementById("notificaciones");

    if (iconoNotif) {
        iconoNotif.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                icon: "info",
                title: "No hay notificaciones",
                text: "Revisa más tarde",
                confirmButtonText: "Ok"
            });
        });
    }
});
