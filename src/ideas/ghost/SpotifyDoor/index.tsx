import { SpotifyAuthInitiator } from "spotify-auth/spotify-auth-intiator";
import LoginForm from "./ideas/LoginForm";

const initiator = new SpotifyAuthInitiator();

export default function SpotifyDoor() {
  // const fetcher = new SpotifyAccessTokenFetcher();
  // const url = new URL(window.location.href);
  // const code = url.searchParams.get("code") as string;
  // fetcher.fetchAccessToken(code).then(console.log);

  return <LoginForm onClick={initiator.initiate.bind(initiator)} />;
}
