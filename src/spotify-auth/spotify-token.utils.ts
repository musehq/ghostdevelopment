const LOCAL_STORAGE_TOKEN_KEY = "ACCESS_TOKEN";

/**
 *
 * @description Providing the value as null will remove the access token from the local storage
 */
export function setLocalAccessToken(token?: string | null) {
    if (token) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }
}

export function getLocalAccessToken() {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    return token;

}