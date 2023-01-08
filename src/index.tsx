import React from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Canvas orthographic camera={{ zoom: 1 }}>
    <color attach="background" args={["#000"]} />
    <App />
  </Canvas>
);
