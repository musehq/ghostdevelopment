import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { useLimitedFrame, usePlayer } from "spacesvr";
import useAxios from "./logic/spotify-auth/spotify-http-client/spotify-http-client";
import { getLocalAccessToken } from "./logic/spotify-auth/spotify-token.utils";
import { calculateDistance } from "./logic/utils/geometry.utils";
import { GroupProps } from "@react-three/fiber";
import { Group, Vector3 } from "three";

type SpotifySpeakerProps = {
  songId?: string;
  radius: number;
} & GroupProps;

export default function SpotifySpeaker(props: SpotifySpeakerProps) {
  const { songId, radius, ...rest } = props;

  const player = usePlayer();
  const accessTokenRef = useRef(getLocalAccessToken());

  const group = useRef<Group>(null);
  const distance = useRef(0);
  const [inRange, setInRange] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const { response, sendRequest } = useAxios<SpotifySingleTrackResponse>();
  const [dummy] = useState(new Vector3());

  useLimitedFrame(70, () => {
    if (!group.current) return;
    const position = player.position.get();
    group.current.getWorldPosition(dummy);
    distance.current = calculateDistance(dummy, position);
    if (distance.current < radius) {
      setInRange(true);
    } else {
      setInRange(false);
    }
  });

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
    <group ref={group} {...rest}>
      <mesh>
        <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="green" />
      </mesh>
      {accessTokenRef.current && response?.data.uri ? (
        <Html style={{ display: "none" }}>
          <SpotifyPlayer
            hideAttribution={true}
            hideCoverArt={true}
            play={isPlaying && inRange}
            token={accessTokenRef.current}
            uris={response?.data.uri ?? ""}
          />
          ;
        </Html>
      ) : (
        <></>
      )}
    </group>
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
