import { SpotifyAccessTokenResponse } from "../spotify-auth-token/spotify-access-token-response.interface";

export function parseSpoitifyAccessTokenResponse(
  response?: SpotifyAccessTokenResponse | null
) {
  const token = response?.access_token;
  const refreshToken = response?.refresh_token;
  if (token && refreshToken) {
    return { token, refreshToken };
  }
  return null;
}
