import { useFrame, GroupProps } from "@react-three/fiber";
import { useState } from "react";
import React from "react";
import MagicText from "./ideas/MagicText";
import { KORN_FONT } from "./logic/constants";
import { animated, config, useSpring } from "@react-spring/three";
import {
  Button,
  TextInput,
  useKeypress,
  usePlayer,
  Collidable,
} from "spacesvr";

type GhostDoorProps = { opacity?: number; password?: string } & GroupProps;

/*
1 - question
2 - wrong
3 - right
*/

export default function GhostDoor(props: GhostDoorProps) {
  const { opacity = 0.6, password = "test", ...restProps } = props;
  const [stage, setStage] = useState(1);

  const player = usePlayer();

  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [card, setCard] = useState<number>();
  const [email, setEmail] = useState("");

  const inValue =
    stage === 1 ? who : stage === 2 ? why : stage === 4 ? email : "";
  const placeholder =
    stage === 1
      ? "Type a name"
      : stage === 2
      ? "Type a message"
      : stage === 4
      ? "Type your email"
      : "";
  const inSetter =
    stage === 1
      ? setWho
      : stage === 2
      ? setWhy
      : stage === 4
      ? setEmail
      : undefined;

  const BUTTON_ENABLED =
    (stage === 1 && who.length > 0) ||
    (stage === 2 && why.length > 0) ||
    (stage === 4 && email.length > 0);

  const [collidable, setCollidable] = useState(true);

  const INPUTS_ENABLED = true;
  const { posY, scale, posX } = useSpring({
    posY: INPUTS_ENABLED ? 0.6 : -0.8,
    scale: INPUTS_ENABLED ? 1 : 0,
    posX: stage === 3 ? 1.1 : 0,
    ...config.gentle,
  });

  const doorMesh = React.useRef();

  return (
    <group name="door">
      <group position-y={1} position-z={1}>
        <MagicText stage={stage} visible />
        <animated.group position-y={posY} scale={scale}>
          <group position-y={-0.2}>
            <TextInput
              key={`input-${stage}`}
              position-y={-0.5}
              fontSize={0.065}
              width={1}
              // @ts-ignore
              font={null}
              value={inValue}
              onChange={inSetter}
              rotation-x={-0.1}
              placeholder={placeholder}
            />
            {BUTTON_ENABLED && (
              <Button
                position-y={-0.625}
                position-z={0.1}
                rotation-x={-0.3}
                width={0.4}
                scale={0.8}
                font={KORN_FONT}
                onClick={() =>
                  setStage(
                    checkPassword({ userPassword: inValue, password: password })
                  )
                }
              >
                next
              </Button>
            )}
          </group>
        </animated.group>
      </group>
      <Collidable enabled={stage === 3 ? false : true}>
        <animated.group position-x={posX}>
          <mesh rotation-x={-Math.PI / 2} ref={doorMesh}>
            <boxBufferGeometry args={[1, 0.1, 5]} />
            <meshStandardMaterial color="white" opacity={opacity} />
          </mesh>
        </animated.group>
      </Collidable>
    </group>
  );
}

// password checker
type CheckPasswordProps = {
  userPassword: string;
  password: string;
};

function checkPassword(props: CheckPasswordProps) {
  const { userPassword, password } = props;

  if (password === userPassword) {
    console.log("correct");
    return 3;
  }
  console.log("wrong");
  return 2;
}
