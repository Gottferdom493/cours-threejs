import Scene from "../three/Scene.js";
import Form from "./Form.js";

new Form();
new Scene(
  "canvas-luke",
  "#div-canvas-luke",
  ["../../assets/gltf/luke_v03.gltf"],
  0x00ff00
);
new Scene(
  "canvas-vador",
  "#div-canvas-vador",
  ["../../assets/gltf/vador_v05.gltf"],
  0xff0000
);