import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import { useLimitedFrame, usePlayer } from "spacesvr";
import useAxios from "spotify-auth/spotify-http-client/spotify-http-client";
import { getLocalAccessToken } from "spotify-auth/spotify-token.utils";
import { Vector3 } from "three";
import { calculateDistance } from "utils/geometry.utils";


type SpotifySpeakerProps = { songId?: string; centerPosition: Vector3, radius: number };


export default function SpotifySpeaker(props: SpotifySpeakerProps) {
  const { songId, centerPosition, radius } = props;
  const player = usePlayer();
  const position = player.position.get();
  const accessTokenRef = useRef(getLocalAccessToken());

  const [distance, setDistance] = useState(calculateDistance(centerPosition, position));
  const [isPlaying, setIsPlaying] = useState(false);
  const { response, sendRequest } = useAxios<SpotifySingleTrackResponse>();

  useLimitedFrame(70, () => {
    const position = player.position.get();
    const distance = calculateDistance(centerPosition, position);
    setDistance(distance);
  })
  useMemo(() => {
    console.log(distance);
    console.log(isPlaying && distance <= radius);
  }, [isPlaying, distance, radius]);

  useEffect(() => {
    const playOnClick = () => {
      setIsPlaying(true);
      document.removeEventListener("click", playOnClick);
      document.addEventListener("pointerup", playOnClick);
    };

    document.addEventListener("click", playOnClick);
    document.addEventListener("pointerup", playOnClick);

    if (accessTokenRef.current) {
      sendRequest({
        method: "GET",
        url: `/v1/tracks/${songId}`,
      });
    }
  }, [accessTokenRef, songId]);

  return (
    (accessTokenRef.current && response?.data.uri) ?
      <Html style={{ display: "none" }}>
        <SpotifyPlayer hideAttribution={true} hideCoverArt={true} play={isPlaying && distance <= radius} token={accessTokenRef.current} uris={response?.data.uri ?? ""} />;
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
