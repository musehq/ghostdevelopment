import axios from "axios";
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
      .then((response) => response.data.access_token);
  }
}
