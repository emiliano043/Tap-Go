const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

apiGet("/menu", token).then(data => {
    const div = document.getElementById("menu");
    div.innerHTML = "<h2>Menú</h2>";
    data.forEach(item => {
        div.innerHTML += `<p>${item.nombre} - $${item.precio}</p>`;
    });
});
