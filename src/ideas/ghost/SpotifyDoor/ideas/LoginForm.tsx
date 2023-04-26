import { animated } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { MouseEventHandler } from "react";
import { Collidable } from "spacesvr";

type LoginFormProps = {
  onClick: MouseEventHandler;
};

export default function LoginForm(props: LoginFormProps) {
  return (
    <group name="door">
      <Collidable>
        <animated.group position-x={1} position-z={-8.13}>
          <Html transform>
            <div
              style={{
                width: "30vw",
                height: "40vw",
                backgroundColor: "#ffffff",
                margin: "3px",
                padding: "4px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "2rem",
                gap: "12px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 22px 0px",
              }}
            >
              <img
                width={150}
                src="https://developer.spotify.com/images/guidelines/design/logo-size.svg"
                alt=""
              />
              <h3>Discover</h3>
              <p style={{ fontSize: "14px" }}>Follow these guidelines.</p>
              <button
                onClick={props.onClick}
                style={{
                  color: "#ffffff",
                  backgroundColor: "#1db954",
                  border: "0px",
                  margin: "3px",
                  padding: "10px",
                  borderRadius: "1rem",
                  width: "15vw",
                  marginTop: "3rem",
                }}
              >
                Log in with spotify
              </button>
            </div>
          </Html>
          <meshStandardMaterial color="#000000" roughness={1} />
        </animated.group>
      </Collidable>
    </group>
  );
}
