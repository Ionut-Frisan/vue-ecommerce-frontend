import axios from "axios";

export const getOrders = async () => {
    let response;
    await axios.get('/orders')
        .then((res) => response = res.data.data || [])
        .catch((err) => response = [])
    console.log(response)
    return response;
}