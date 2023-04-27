import axios from "axios";
import { useState } from "react";
import useAxios from "spotify-auth/spotify-http-client";
import { setLocalAccessToken } from "spotify-auth/spotify-token.utils";
import { PKCEHandler } from "./pkce-handler";
import spotifyEnvironment from "./spotify-environment";

interface SpotifyAccessTokenResponse {
  access_token: string;
}

export class SpotifyAccessTokenFetcher {
  private readonly _pkceVerifier = new PKCEHandler();

  fetchAccessToken(code: string) {
    const codeVerifier = this._pkceVerifier.retrieveCodeVerifier() as string;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: spotifyEnvironment.redirectUri,
      client_id: spotifyEnvironment.clientID,
      code_verifier: codeVerifier,
    });
    return axios
      .post<SpotifyAccessTokenResponse>(
        `${spotifyEnvironment.spotifyBaseURL}/api/token`,
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(response => {
        this._pkceVerifier.clearLocalCodeVerifier();
        return response;
      })
      .then((response) => response.data.access_token);
  }
}

export const useSpotifyAccessTokenFetcher = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const { sendRequest } = useAxios<SpotifyAccessTokenResponse>();
  const pkceVerifier = new PKCEHandler();
  const fetchAccessToken = (code: string) => {
    const codeVerifier = pkceVerifier.retrieveCodeVerifier() as string;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: spotifyEnvironment.redirectUri,
      client_id: spotifyEnvironment.clientID,
      code_verifier: codeVerifier,
    });
    return sendRequest({
      url: "/api/token",
      data: body,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    }).then((response) => {
      const token = response?.data.access_token;
      setLocalAccessToken(token);
      setAccessToken(token);
      pkceVerifier.clearLocalCodeVerifier();
      return token;
    });

  }


  return { accessToken, fetchAccessToken };
}
