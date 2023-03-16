import GlobalScene from "../three/GlobalScene.js";
import Form from "./Form.js";
import "../../css/style.css";
import "../../css/accueil.css";
import lukeGltf from "../../assets/gltf/luke_v03.gltf";
import vadorGltf from "../../assets/gltf/vador_v05.gltf";

new Form();
new GlobalScene(
  "canvas-luke",
  "#div-canvas-luke",
  [lukeGltf],
  0x00ff00
);
new GlobalScene(
  "canvas-vador",
  "#div-canvas-vador",
  [vadorGltf],
  0xff0000
);