import { useRef, useState } from "react";
import { SpotifyAccessTokenResponse } from "../spotify-auth-token/spotify-access-token-response.interface";
import { parseSpoitifyAccessTokenResponse } from "../spotify-auth-token/spotify-access-token-response.praser";
import useAxios from "../spotify-http-client/spotify-http-client";
import { setLocalAccessToken } from "../spotify-token.utils";
import { PKCEHandler } from "../pkce-handler";
import spotifyEnvironment from "../spotify-environment";

export const useSpotifyAccessTokenFetcher = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const { sendRequest } = useAxios<SpotifyAccessTokenResponse>();
  const pkceVerifierRef = useRef(new PKCEHandler());
  const fetchAccessToken = (code: string) => {
    const codeVerifier =
      pkceVerifierRef.current.retrieveCodeVerifier() as string;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: spotifyEnvironment.redirectUri,
      client_id: spotifyEnvironment.clientID,
      code_verifier: codeVerifier,
    });
    return sendRequest({
      url: "https://accounts.spotify.com/api/token",
      data: body,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((response) => {
      const tokens = parseSpoitifyAccessTokenResponse(response?.data);
      if (tokens) {
        setLocalAccessToken(tokens);
        setAccessToken(tokens.token);
      }
      pkceVerifierRef.current.clearLocalCodeVerifier();
      return tokens?.token;
    });
  };
  return { accessToken, fetchAccessToken };
};
