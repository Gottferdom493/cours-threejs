import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";

export default class Personnage3D {
  constructor(scene, gltfPath, cubeTexture) {
    this.scene = scene;
    this.importGLTF(gltfPath, cubeTexture);
  }

  importGLTF(gltfPath, cubeTexture) {
    const loader = new GLTFLoader();

    loader.load(gltfPath, (gltf) => {
      this.scene.add(gltf.scene);
      gltf.scene.traverse((node) => {
        if (node.isMesh) {
          node.material.envMap = cubeTexture;
          node.material.envMapIntensity = 0.5;
        }
      });
    })
  }
}