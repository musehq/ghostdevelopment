import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import spotifyEnvironment from "spotify-auth/spotify-environment";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";

const client = axios.create({
  baseURL: spotifyEnvironment.spotifyBaseURL,
});

const useAxios = <T>() => {
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null);
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(true);

  const accessToken = getLocalAccessToken();

  client.interceptors.request.use(function (config) {
    if (!accessToken) {
      return config;
    }
    config.headers.set("Authorization", `Bearer ${accessToken}`);
    return config;
  });

  const sendRequest = async (axiosParams: AxiosRequestConfig) => {
    try {
      const result = await client.request<T>(axiosParams);
      setResponse(result);
      return result;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, sendRequest };
};

export default useAxios;
