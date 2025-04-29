document.addEventListener("DOMContentLoaded", function () {
    const nombre = localStorage.getItem("clienteNombre");
    const id = localStorage.getItem("clienteId");
    const fecha = localStorage.getItem("clienteFechaRegistro");

    if (nombre) {
        document.querySelector(".nombre").textContent = `Bienvenido: ${nombre}`;
    }
    if (id) {
        document.querySelector(".id").textContent = `Su ID: ${id}`;
    }
    if (fecha) {
        const fechaFormateada = new Date(fecha).toLocaleDateString();
        document.querySelector(".fecharegistro").textContent = `Fecha de Registro: ${fechaFormateada}`;
    }

    // AHORA TAMBIÉN AQUÍ DENTRO:

    const links = document.querySelectorAll(".barra a");
    const currentPath = window.location.pathname.toLowerCase();

    links.forEach(link => {
        const hrefPath = link.getAttribute("href").toLowerCase();

        if (currentPath === hrefPath || (currentPath.startsWith(hrefPath) && hrefPath !== "/")) {
            link.classList.add("activo");
        }
    });
});
