import { GroupProps } from "@react-three/fiber";
import Speaker from "ideas/players/Speaker";
import { useEffect, useState } from "react";
import useAxios from "spotify-auth/spotify-http-client";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";

type ImageZoomProps = { opacity?: number; password?: string } & GroupProps;

export default function SpotifySpeaker(props: ImageZoomProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const accessToken = getLocalAccessToken();
  const { response, sendRequest } = useAxios<SpotifySingleTrackResponse>();
  useEffect(() => {
    sendRequest({
      method: "GET",
      url: "/v1/tracks/2HZLXBOnaSRhXStMLrq9fD",
    });
  }, []);

  return <Speaker audioUrl={response?.data.external_urls.spotify} />;
}

interface SpotifySingleTrackResponse {
  id: string;
  external_urls: {
    spotify: string;
  };
  is_playable?: string;
}
