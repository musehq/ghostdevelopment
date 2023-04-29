import { InternalAxiosRequestConfig } from "axios";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";

export function setAccessTokenIfAvailableOnRequestInterceptor(config: InternalAxiosRequestConfig) {
    const accessToken = getLocalAccessToken();
    if (!accessToken) {
        return config;
    }
    config.headers.set("Authorization", `Bearer ${accessToken}`);
    return config;
}