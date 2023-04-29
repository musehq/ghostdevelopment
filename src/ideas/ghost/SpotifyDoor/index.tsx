import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSpotifyAccessTokenFetcher } from "spotify-auth/spotify-access-token-fetcher";
import { SpotifyAuthInitiator } from "spotify-auth/spotify-auth-intiator";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";
import ERROR from "./ideas/Error";
import Loading from "./ideas/Loading";
import Loggedin from "./ideas/Loggedin";
import LoginForm from "./ideas/LoginForm";


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

export default function SpotifyDoor() {
  const accessToken = getLocalAccessToken();
  const [state, setState] = useState<keyof typeof State>(
    accessToken !== null ? "LOGGED_IN" : "ACCESS_TOKEN"
  );
  const { fetchAccessToken } = useSpotifyAccessTokenFetcher();
  const router = useRouter();

  useEffect(() => {
    const { code, ...routerQuery } = router.query;
    if (accessToken) {
      setState("LOGGED_IN");
    } else if (code) {
      fetchAccessToken(code as string)
        .then(() => {
          router.replace(
            {
              query: { ...routerQuery },
            },
            {},
            { shallow: true }
          );
          setState("LOGGED_IN");
        })
        .catch(() => setState("ERROR"));
    } else {
      setState("CODE");
    }
  }, []);
  return <>
    <Panel state={state} /></>
}
