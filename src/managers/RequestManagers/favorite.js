import axios from "axios";

export const addToFavorite = async (productId) => {
    if(!productId) return {success: false, data: "No product was selected"}
    let response;
    await axios.post(`/favorites/${productId}`)
        .then(res => response = res.data)
        .catch(err => response = {success: false, data: err.error})
    return response;
}

export const getMyFavorites = async () => {
    let response;
    await axios.get('/favorites')
        .then((res) => response = res.data.data || [])
        .catch((err) => response = [])
    const favorites = response.filter(item => (!!item.product && typeof item.product === "object")).map(item => ({...item.product, favorite: true}))
    return favorites;
}

export const removeFromFavorites = async (productId) => {
    if(!productId) return {success: false, data: "No product was selected"}
    let response;
    await axios.delete(`/favorites/${productId}`)
        .then(res => response = res.data)
        .catch(err => response = {success: false, data: err.error})
    return response;
}