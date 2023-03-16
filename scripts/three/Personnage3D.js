import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class Personnage3D {
  constructor(globalScene, gltfPath, cubeTexture) {
    this.globalScene = globalScene;
    this.importGLTF(gltfPath, cubeTexture);
  }

  importGLTF(gltfPath, cubeTexture) {
    const loader = new GLTFLoader();

    loader.load(gltfPath, (gltf) => {
      this.globalScene.scene.add(gltf.scene);
      gltf.scene.traverse((node) => {
        if (node.isMesh) {
          node.material.envMap = cubeTexture;
          node.material.envMapIntensity = 0.5;
        }
      });
      this.globalScene.loader.remove();
    })
  }
}