
//  API remota (descomenta si despliegas en producción)
window.TapAndGoApi = {
    get: function (endpoint, token) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: "Bearer " + token }
        }).then(res => res.json());
    }
}

function apiGet(path, token) {
    return fetch(`http://a79ae1b393e2246f5813f8c16a8028b9-123841045.us-east-1.elb.amazonaws.com/api${path}`, {
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
