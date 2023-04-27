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
        <animated.group position-z={-8.13}>
          <Html transform>
            <div
              style={{
                width: "30%",
                height: "100%",
                backgroundColor: "#191414",
                margin: "2rem",
                padding: "7rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "#ffffff",
                alignItems: "center",
                borderRadius: ".6rem",
                gap: "12px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 22px 0px",
              }}
            >
              <img width={180} src="../Spotify_Logo_RGB_Green.png" alt="" />
              <h3>Discover</h3>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "2rem",
                  marginBottom: "-2.6rem",
                  color: "#ffffff7d",
                }}
              >
                Follow the guidelines.
              </p>
              <button
                onClick={props.onClick}
                style={{
                  color: "#ffffff",
                  backgroundColor: "#1db954",
                  border: "0px",
                  margin: "3px",
                  // padding: "10px",
                  borderRadius: "3rem",
                  width: "15rem",
                  marginTop: "3rem",
                  boxShadow: "rgba(0, 0, 0.1,1) 0px 7px 22px 0px ",
                }}
              >
                <p style={{ fontSize: "17px" }}>Log in with spotify</p>
              </button>
            </div>
          </Html>
          <meshStandardMaterial color="#000000" roughness={1} />
        </animated.group>
      </Collidable>
    </group>
  );
}
