import { AxiosError, AxiosInstance } from "axios";
import { requestRefreshToken } from "../spotify-auth-token/spotify-request-refresh-token";
import { getLocalAccessToken } from "../spotify-token.utils";

/**
 *
 * @description Requests a new access token if the old is expired
 *  and re-run the request
 */
export function refreshAccessTokenIfExpiredInterceptor<T>(
  error: any,
  client: AxiosInstance
) {
  if (canRequestRefreshToken(error)) {
    requestRefreshToken(client).then(() => {
      return client.request<T>(error.config);
    });
  } else {
    return Promise.reject(error);
  }
}

function canRequestRefreshToken(error: AxiosError) {
  const accessToken = getLocalAccessToken();

  return (
    error?.response?.status === 401 &&
    accessToken &&
    !error?.config?.url?.includes("token")
  );
}
