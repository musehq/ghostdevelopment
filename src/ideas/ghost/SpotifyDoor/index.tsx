import { Html } from "@react-three/drei";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Collidable } from "spacesvr";
import { useSpotifyAccessTokenFetcher } from "spotify-auth/spotify-access-token-fetcher";
import { SpotifyAuthInitiator } from "spotify-auth/spotify-auth-intiator";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";
import LoginForm from "./ideas/LoginForm";

enum State {
  CODE,
  ACCESS_TOKEN,
  LOGGED_IN,
  ERROR
}

function Loader() {
  return (
    <Collidable>
      <Html transform>
        <p>Loading</p>
      </Html>
    </Collidable>
  )
}


function Loggedin() {
  return (
    <Collidable>
      <Html transform>
        <p>LOGGED IN</p>
      </Html>
    </Collidable>
  )
}

function Error() {
  return (
    <Collidable>
      <Html transform>
        <p>Error</p>
      </Html>
    </Collidable>
  )
}

export default function SpotifyDoor() {
  const initiatorRef = useRef(new SpotifyAuthInitiator());
  const [state, setState] = useState<keyof typeof State>("ACCESS_TOKEN");
  const { fetchAccessToken } = useSpotifyAccessTokenFetcher();
  const router = useRouter();

  useEffect(() => {
    const { code, ...routerQuery } = router.query;
    const accessToken = getLocalAccessToken();
    if (accessToken) {
      setState("LOGGED_IN");
    }
    else if (code) {
      router.replace({
        query: { ...routerQuery },
      });
      fetchAccessToken(code as string)
        .then(() => {
          setState("LOGGED_IN");
        })
        .catch(() => setState("ERROR"));
    }
    else {
      setState("CODE");
    }
  }, [state, fetchAccessToken, router])

  if (state === "CODE") {
    return <LoginForm onClick={initiatorRef.current.initiate.bind(initiatorRef.current)} />
  }
  else if (state === "LOGGED_IN") {
    return <Loggedin />;
  }
  else if (state === "ERROR") {
    return <Error />
  }
  else {
    return <Loader />;
  }
}
