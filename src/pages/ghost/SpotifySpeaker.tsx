import dynamic from "next/dynamic";

const DeveloperReality = dynamic(import("realities/DeveloperReality"), {
  ssr: false,
});

const Idea = dynamic(import("ideas/ghost/SpotifySpeaker"), { ssr: false });

export default () => (
  <DeveloperReality>
    <Idea songId="2HZLXBOnaSRhXStMLrq9fD" />
  </DeveloperReality>
);
