
const backendUrl = import.meta.env.PROD
        ? 'https://urchin-app-xyh7n.ondigitalocean.app'
        : 'http://localhost:5000';

const restApiVersion = 'v1';
const restApiPath = `api/${restApiVersion}`;
const uploadsPath = 'uploads';

const apiUrl = `${backendUrl}/${restApiPath}`;
const uploadsUrl = `${backendUrl}/${uploadsPath}`;

export const config = {
    backendUrl,
    restApiPath,
    apiUrl,
    restApiVersion,
    uploadsPath,
    uploadsUrl,
}