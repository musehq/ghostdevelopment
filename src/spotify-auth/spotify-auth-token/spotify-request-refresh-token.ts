import { AxiosInstance } from "axios";
import { SpotifyAccessTokenResponse } from "spotify-auth/spotify-auth-token/spotify-access-token-response.interface";
import { parseSpoitifyAccessTokenResponse } from "spotify-auth/spotify-auth-token/spotify-access-token-response.praser";
import spotifyEnvironment from "spotify-auth/spotify-environment";
import { getLocalRefreshToken, removeLocalAccessToken, setLocalAccessToken } from "spotify-auth/spotify-token.utils";


export function requestRefreshToken(client: AxiosInstance) {
  const refreshToken = getLocalRefreshToken();
  removeLocalAccessToken();
  return client.request<SpotifyAccessTokenResponse>({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    data: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: spotifyEnvironment.clientID
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(response => {
    const tokens = parseSpoitifyAccessTokenResponse(response?.data);
    if (tokens) {
      setLocalAccessToken(tokens);
    }
    return tokens?.token;
  });

}