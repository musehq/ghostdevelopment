import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import useAxios from "spotify-auth/spotify-http-client";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";

type SpotifySpeakerProps = { songId?: string; };


export default function SpotifySpeaker(props: SpotifySpeakerProps) {
  const accessToken = getLocalAccessToken();
  const [isPlaying, setIsPlaying] = useState(false);
  const { response, sendRequest } = useAxios<SpotifySingleTrackResponse>();
  useEffect(() => {
    const playOnClick = () => {
      setIsPlaying(true);
      document.removeEventListener("click", playOnClick);
      document.addEventListener("pointerup", playOnClick);
    };

    document.addEventListener("click", playOnClick);
    document.addEventListener("pointerup", playOnClick);

    if (accessToken) {
      sendRequest({
        method: "GET",
        url: `/v1/tracks/${props.songId}`,
      });
    }
  }, [accessToken, props]);

  return (
    (accessToken && response?.data.uri) ?
      <Html style={{ display: "none" }}>
        <SpotifyPlayer hideAttribution={true} hideCoverArt={true} play={isPlaying} token={accessToken} uris={response?.data.uri ?? ""} />;
      </Html> : <></>
  );
}

interface SpotifySingleTrackResponse {
  id: string;
  external_urls: {
    spotify: string;
  };
  is_playable?: string;
  uri: string;
}
