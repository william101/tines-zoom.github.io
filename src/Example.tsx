import React, { useRef } from "react";
import logo from "./logo.svg";
import usePanZoom from "./panZoom/usePanZoom";

export default function Example() {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  usePanZoom({
    container: container,
    target: canvas,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        height: "100%",
        overflow: "hidden",
        background: "#282c34",
      }}
    >
      <div
        ref={container}
        style={{
          width: "50%",
          border: "5px solid black",
          background: "#ffffff",
          overflow: "hidden",
          cursor: "grab"
        }}
      >
        <div ref={canvas} style={{ background: "#5c6b88", display: "flex", flexDirection: "column" }}>
          <h1>React + Typescript pan and zoom</h1>
          <img src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
}
