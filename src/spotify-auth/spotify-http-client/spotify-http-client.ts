import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import spotifyEnvironment from "spotify-auth/spotify-environment";
import { refreshAccessTokenIfExpiredInterceptor } from "spotify-auth/spotify-http-client/refresh-access-token-if-expired.intercepter";
import { setAccessTokenIfAvailableOnRequestInterceptor } from "spotify-auth/spotify-http-client/set-access-token.intercepter";

const client = axios.create({
  baseURL: spotifyEnvironment.spotifyBaseURL,
});

const useAxios = <T>() => {
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null);
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);

  client.interceptors.request.use(setAccessTokenIfAvailableOnRequestInterceptor);
  client.interceptors.response.use((response) => response, (err) => refreshAccessTokenIfExpiredInterceptor(err, client));

  const sendRequest = async (axiosParams: AxiosRequestConfig) => {
    try {
      const result = await client.request<T>(axiosParams);
      setResponse(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, sendRequest };
};

export default useAxios;


