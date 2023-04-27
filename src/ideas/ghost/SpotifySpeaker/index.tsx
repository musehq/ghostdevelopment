import { Html } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useEffect } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import useAxios from "spotify-auth/spotify-http-client";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";

type ImageZoomProps = { opacity?: number; password?: string } & GroupProps;


export default function SpotifySpeaker(props: ImageZoomProps) {
  const accessToken = getLocalAccessToken() as string;
  const { response, sendRequest } = useAxios<SpotifySingleTrackResponse>();

  useEffect(() => {
    sendRequest({
      method: "GET",
      url: "/v1/tracks/2HZLXBOnaSRhXStMLrq9fD",
    });
  }, []);

  return <Html>
    <SpotifyPlayer token={accessToken} uris={response?.data.uri ?? ""} />;
  </Html>
}

interface SpotifySingleTrackResponse {
  id: string;
  external_urls: {
    spotify: string;
  };
  is_playable?: string;
  uri: string;
}
