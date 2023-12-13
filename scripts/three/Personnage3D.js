import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";

import { degToRad } from "../utils";

export default class Personnage3D {
  constructor({
    globalScene,
    gltfPath,
    cubeTexture,
    coordonnees = { x: 0, y: 0, z: 0 },
    coordonneesMobile = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    initAnimation,
    needChangeColorSaber = false
  }) {
    this.globalScene = globalScene;
    this.coordonnees = coordonnees;
    this.coordonneesMobile = coordonneesMobile;
    this.rotation = rotation;

    this.animationsAction = {};
    this.initAnimation = initAnimation;

    this.clock = new THREE.Clock();

    this.needChangeColorSaber = needChangeColorSaber;

    this.importGLTF(gltfPath, cubeTexture);
    this.animate();
  }

  importGLTF(gltfPath, cubeTexture) {
    const loader = new GLTFLoader();

    loader.load(gltfPath, (gltf) => {
      this.globalScene.objectsLoaded++;
      this.globalScene.scene.add(gltf.scene);
      this.updateTextureSceneGltf(
        gltf.scene,
        cubeTexture
      );
      this.updateColorSaberWithLocalStorage();

      this.gltf = gltf;

      if (window.innerWidth < this.globalScene.sizeMobile) {
        this.setPositionMobileVersion();
      } else {
        this.setPositionLaptopVersion();
      }

      gltf.scene.rotation.y = degToRad(this.rotation.y);

      this.setAnimations(gltf.animations, gltf.scene);

      this.globalScene.onceGltfAreLoaded();
    })
  }

  setPositionMobileVersion() {
    this.gltf.scene.position.x = this.coordonneesMobile.x;
    this.gltf.scene.position.y = this.coordonneesMobile.y;
    this.gltf.scene.position.z = this.coordonneesMobile.z;
  }

  setPositionLaptopVersion() {
    this.gltf.scene.position.x = this.coordonnees.x;
    this.gltf.scene.position.y = this.coordonnees.y;
    this.gltf.scene.position.z = this.coordonnees.z;
  }

  updateTextureSceneGltf(sceneGltf, cubeTexture) {
    sceneGltf.traverse((node) => {
      if (node.isMesh) {
        if (node.name.includes("sabre")) {
          this.materialSaber = node.material;
        }
        node.material.envMap = cubeTexture;
        node.material.envMapIntensity = 0.5;
      }
    });
  }

  updateColorSaber(colorSaber) {
    if (colorSaber) {
      this.materialSaber.emissive = new THREE.Color(
        colorSaber
      );
    }
  }

  updateColorSaberWithLocalStorage() {
    const colorFromStorage = localStorage.getItem("colorSaber");
    if (this.needChangeColorSaber && colorFromStorage) {
      this.updateColorSaber(colorFromStorage);
    }
  }

  setAnimations(animationsGltf, sceneGltf) {
    this.mixer = new THREE.AnimationMixer(sceneGltf);

    for (let animationClip of animationsGltf) {
      this.animationsAction[animationClip.name] =
        this.mixer.clipAction(animationClip);
      this.animationsAction[
        animationClip.name
      ].clampWhenFinished = true
    }

    this.currentAction = this.animationsAction[this.initAnimation];
    this.animationsAction[this.initAnimation].play();
  }

  stopAllAnimations(callback) {
    this.currentAction.fadeOut(0.1);
    setTimeout(() => {
      for (let animationKey of Object.keys(this.animationsAction)) {
        this.animationsAction[animationKey].stop();
      }
      callback();
    }, 100);
  }

  playAnimation(name) {
    return new Promise((resolve) => {
      const resetAnimationToBase = () => {
        this.stopAllAnimations(() => {
          this.mixer.removeEventListener(
            "finished",
            resetAnimationToBase
          );
          this.currentAction =
            this.animationsAction[this.initAnimation]
            .setLoop(THREE.LoopRepeat)
            .play();
          resolve();
        });
      }

      this.stopAllAnimations(() => {
        this.mixer.addEventListener(
          "finished",
          resetAnimationToBase
        );
        this.currentAction = this.animationsAction[name]
        .setLoop(THREE.LoopOnce)
        .play();
      });
    });
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }
  }
}