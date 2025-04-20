
//  API remota (descomenta si despliegas en producción)
window.TapAndGoApi = {
    get: function (endpoint, token) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: "Bearer " + token }
        }).then(res => res.json());
    }
}

function apiGet(path, token) {
    return fetch(`http://192.168.1.137:7034/api${path}`, {
        headers: { Authorization: "Bearer " + token }
    }).then(res => res.json());
}


function apiPost(endpoint, data, token) {
    return fetch(API_BASE_URL + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}
