import { PKCEHandler } from "./pkce-handler";
import spotifyEnvironment from "./spotify-environment";

export class SpotifyAuthInitiator {
  private readonly _pkceVerifier = new PKCEHandler();

  private getScope() {
    return spotifyEnvironment.scopes.join(" ");
  }

  async initiate() {
    const codeChallenge =
      await this._pkceVerifier.generateAndSaveCodeChallenge();
    const scope = this.getScope();

    const args = new URLSearchParams({
      response_type: "code",
      client_id: spotifyEnvironment.clientID,
      scope: scope,
      redirect_uri: spotifyEnvironment.redirectUri,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    const url = `https://accounts.spotify.com/authorize?${args}`;
    window.location.replace(url);
  }
}
