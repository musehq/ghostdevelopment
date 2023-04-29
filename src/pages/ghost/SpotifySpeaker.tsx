import dynamic from "next/dynamic";
import { Vector3 } from "three";

const DeveloperReality = dynamic(import("realities/DeveloperReality"), {
  ssr: false,
});

const Idea = dynamic(import("ideas/ghost/SpotifySpeaker"), { ssr: false });

export default () => (
  <DeveloperReality>
    <Idea radius={-5} position={new Vector3(1, 1, 1)} centerPosition={new Vector3(1, 1, 1)} songId="2HZLXBOnaSRhXStMLrq9fD" />
  </DeveloperReality>
);
