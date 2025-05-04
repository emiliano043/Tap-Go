
//  API remota (descomenta si despliegas en producción)
window.TapAndGoApi = {
    get: function (endpoint, token) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: "Bearer " + token }
        }).then(res => res.json());
    }
}

function apiGet(path, token) {
    return fetch(`af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api${path}`, {
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
