import axios from "axios";

export const checkToken = async () => {
    let authenticated = false;
    await axios.get(`/auth/checkAuth`)
        .then(res => { authenticated = res.data.status || false })
        .catch(() => ({}));
    return authenticated;
}