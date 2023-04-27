import { animated } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { Collidable } from "spacesvr";

export default function ERROR() {
  return (
    <group name="door">
      <Collidable>
        <animated.group position-z={-8.13}>
          <Html transform>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#191414",
                margin: "2rem",
                padding: "2rem",
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
              <h3>Loggedin</h3>
            </div>
          </Html>
          <meshStandardMaterial color="#000000" roughness={1} />
        </animated.group>
      </Collidable>
    </group>
  );
}
