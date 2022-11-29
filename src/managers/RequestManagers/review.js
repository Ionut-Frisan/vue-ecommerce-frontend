import axios from "axios";

export const getReviewsForProduct = async (productId) => {
    let reviews = []
    await axios.get(`/products/${productId}/reviews`)
        .then(res => { reviews = res.data.data;})
        .catch(err => {})
    return reviews;
}