import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points } from "@react-three/drei/core/Points";
import { Quaternion, Vector3 } from "three";
import { random, buffer, misc } from "maath";
// @ts-ignore
import reatomLogo from "./assets/reatom.png";

const W = 698;
const H = 204;
const LINE_WIDTH = W * 4;
const REATOM = new Float32Array(W * H * 3);

const rotationAxis = new Vector3(1, 0, 0).normalize();
const q = new Quaternion();

let stop = false;
let i = 0;

export function App(props: any) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [state, setState] = useState<any>(null);

  useEffect(() => {
    let Box, Sphere;
    let p = 0;

    let image: HTMLImageElement | null = new Image();
    image.crossOrigin = "";
    image.src = reatomLogo;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("unable create 2d context");
      }
      ctx.canvas.width = W;
      ctx.canvas.height = H;
      ctx.drawImage(image!, 0, 0);
      const data = ctx.getImageData(0, 0, W, H)?.data;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (data[x * 4 + (H - y - 1) * LINE_WIDTH] < 200) {
            REATOM[p++] = x - W / 2;
            REATOM[p++] = y - H / 2;
            REATOM[p++] = 0;
          }
        }
      }
      image = null;

      Box = random.inBox(new Float32Array(p), { sides: [20, 20, 20] });
      Sphere = random.inSphere(REATOM.slice(0), { radius: 200 });
      setState({
        sphere: Sphere.slice(0),
        reatom: REATOM.slice(0),
        final: Box.slice(0)
      });
    };
  }, []);

  useFrame(({ clock }) => {
    if (!state) {
      return;
    }
    // const et = clock.getElapsedTime();
    const { final, reatom, sphere } = state;
    const t = misc.remap(Math.sin(i), [-1, 1], [0, 1]);

    buffer.rotate(sphere, {
      q: q.setFromAxisAngle(rotationAxis, 0.05)
    });

    if (!stop) {
      buffer.lerp(sphere.slice(), reatom.slice(), final, t);
    }

    if (i >= Math.PI / 2) {
      stop = true;
    }

    i += 0.01;
  });

  if (!state) {
    return null;
  }

  const { final } = state;

  return [
    <Points key={0} positions={final} stride={3} ref={pointsRef}>
      <pointsMaterial size={1} color="white" />
    </Points>
  ];
}
