
//  API remota (descomenta si despliegas en producción)
window.TapAndGoApi = {
    get: function (endpoint, token) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: "Bearer " + token }
        }).then(res => res.json());
    }
}

function apiGet(path, token) {
<<<<<<< HEAD
    return fetch(`af7e3634a244f413d874c590d320c241-124017443.us-east-1.elb.amazonaws.com/api${path}`, {
=======
    return fetch(`http://a79ae1b393e2246f5813f8c16a8028b9-123841045.us-east-1.elb.amazonaws.com/api${path}`, {
>>>>>>> edcf0f03e512ea134731019dbc2e87f0b386082e
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
