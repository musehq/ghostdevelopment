import { useEffect, useRef, useState } from "react";
import { SpotifyAuthInitiator } from "./logic/spotify-auth/spotify-auth-intiator";
import { useSpotifyAccessTokenFetcher } from "./logic/spotify-auth/spotify-auth-token/spotify-access-token-fetcher";
import { getLocalAccessToken } from "./logic/spotify-auth/spotify-token.utils";
import ERROR from "./ideas/Error";
import Loading from "./ideas/Loading";
import Loggedin from "./ideas/Loggedin";
import LoginForm from "./ideas/LoginForm";
import { GroupProps } from "@react-three/fiber";

enum State {
  CODE,
  ACCESS_TOKEN,
  LOGGED_IN,
  ERROR,
}

function Panel(props: { state: keyof typeof State }) {
  const initiatorRef = useRef(new SpotifyAuthInitiator());

  const { state } = props;
  if (state === "CODE") {
    return (
      <LoginForm
        onClick={initiatorRef.current.initiate.bind(initiatorRef.current)}
      />
    );
  } else if (state === "LOGGED_IN") {
    return <Loggedin />;
  } else if (state === "ERROR") {
    return <ERROR />;
  } else {
    return <Loading />;
  }
}

export default function SpotifyDoor(props: GroupProps) {
  const { ...rest } = props;

  const accessToken = getLocalAccessToken();

  const [state, setState] = useState<keyof typeof State>(
    accessToken !== null ? "LOGGED_IN" : "ACCESS_TOKEN"
  );
  const { fetchAccessToken } = useSpotifyAccessTokenFetcher();
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const code = params.get("code");
    if (accessToken) {
      setState("LOGGED_IN");
    } else if (code) {
      fetchAccessToken(code as string)
        .then(() => {
          window.history.replaceState({}, "", "/");
          setState("LOGGED_IN");
        })
        .catch(() => setState("ERROR"));
    } else {
      setState("CODE");
    }
  }, []);
  return (
    <group {...rest}>
      <Panel state={state} />
    </group>
  );
}
