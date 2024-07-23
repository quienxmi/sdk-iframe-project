import { DecodedToken } from '../interfaces/index';

const requiredKeys = [
    'iss',
    'iat',
    'exp',
    'data'
];

function checkKeysInObject(jsonPayload: DecodedToken): boolean {
    const payloadKeys = Object.keys(jsonPayload);
    return requiredKeys.every(key => payloadKeys.includes(key));
}

export function decodeToken(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload: DecodedToken = JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        const currentTime = Math.floor(Date.now() / 1000);
        if (jsonPayload.exp > currentTime && checkKeysInObject(jsonPayload)) {
            return jsonPayload;
        }
        return null;
    } catch (err) {
        return null;
    }
}