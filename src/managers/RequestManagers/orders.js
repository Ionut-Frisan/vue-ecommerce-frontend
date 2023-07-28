import axios from "axios";

export const getOrders = async () => {
    let response;
    await axios.get('/orders')
        .then((res) => response = res.data.data || [])
        .catch((err) => response = [])
    return response;
}

export const getOrderById = async (id) => {
    let response;
    await axios.get(`/orders/${id}`)
        .then((res) => response = res.data.data || {})
        .catch((err) => response = [])
    return response;
}

export const updateOrderStatus = async (id, status, successCallback, errorCallback) => {
    let response;
    await axios.patch(`/orders/${id}/status`, {status: status})
        .then((res) => {
            response = res.data.data || {};
            if(successCallback && typeof successCallback === 'function'){
                successCallback(res.data);
            }
        })
        .catch((err) => {
            response = [];
            if(errorCallback && typeof errorCallback === 'function'){
                errorCallback();
            }
        })
        .finally(() => {});
    return response;
}