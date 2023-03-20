import GlobalScene from "../three/GlobalScene.js";
import Form from "./Form.js";
import "../../css/style.css";
import "../../css/accueil.css";
import "../../assets/favicon.ico";
import lukeGltf from "../../assets/gltf/luke_v05.glb";
import vadorGltf from "../../assets/gltf/vador_v06.glb";

const globalScenes = [];
globalScenes.push(new GlobalScene({
  idCanvas: "canvas-luke",
  divCanvasCssSelector: "#div-canvas-luke",
  gltfPersonnages: [{
    name: "luke",
    gltf: lukeGltf,
    initAnimation: "Idle"
  }],
  colorLights: 0x00ff00,
  isOrbitControls: true
}));
globalScenes.push(new GlobalScene({
  idCanvas: "canvas-vador",
  divCanvasCssSelector: "#div-canvas-vador",
  gltfPersonnages: [{
    name: "vador",
    gltf: vadorGltf,
    initAnimation: "idle"
  }],
  colorLights: 0xff0000,
  isOrbitControls: true
}));
new Form(globalScenes);