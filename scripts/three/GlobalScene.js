import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Personnage3D from "./Personnage3D.js";
import Loader from "../divers/Loader.js";
import nx from "../../assets/hdri/nx.png";
import ny from "../../assets/hdri/ny.png";
import nz from "../../assets/hdri/nz.png";
import px from "../../assets/hdri/px.png";
import py from "../../assets/hdri/py.png";
import pz from "../../assets/hdri/pz.png";

export default class GlobalScene {
  constructor(
    idCanvas,
    canvasCssSelector,
    linksGltfPersonnages,
    colorLights
  ) {
    this.divCanvas = document.querySelector(canvasCssSelector);
    this.linksGltfPersonnages = linksGltfPersonnages;

    this.createScene();
    this.createCamera();
    this.createRenderer(idCanvas);
    this.createControls();
    this.loadAsyncResources(canvasCssSelector);
    this.createLights(colorLights);
    this.addEventOnResize();
    this.addCursorGrabbingOnClick();
    this.animate();
  }

  async loadAsyncResources(canvasCssSelector) {
    this.loader = new Loader(canvasCssSelector);
    this.loader.add();
    const texture = await this.createCubeTexture();
    this.createObjects(texture);
    return texture;
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createRenderer(idCanvas) {
    const canvas = document.getElementById(idCanvas);
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.setSizeRenderer();
  }

  setSizeRenderer() {
    this.renderer.setSize(
      this.divCanvas.clientWidth,
      this.divCanvas.clientHeight
    );
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.getRatio(),
      0.1,
      1000
    );
    this.camera.position.z = 6;
    this.camera.position.y = 2;
  }

  getRatio() {
    return this.divCanvas.clientWidth / this.divCanvas.clientHeight;
  }

  createControls() {
    const controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    controls.enableZoom = false;
    controls.target.set(0, 2.5, 0);
    controls.update();
  }

  createCubeTexture() {
    return new Promise((resolve, reject) => {
      const cubeTextureLoader =
        new THREE.CubeTextureLoader();
        cubeTextureLoader
        .load([
          px,
          nx,
          py,
          ny,
          pz,
          nz
        ], (texture) => {
          resolve(texture);
        });
    });
  }

  createLights(colorLights) {
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(2, 5, 2)
    const pointLight2 = new THREE.PointLight(colorLights, 1, 100);
    pointLight2.position.set(-5, 3, -5)
    this.scene.add(pointLight);
    this.scene.add(pointLight2);
  }

  createObjects(texture) {
    for (let link of this.linksGltfPersonnages) {
      new Personnage3D(
        this,
        link,
        texture
      );
    }
  }

  onResize() {
    this.setSizeRenderer();
    this.camera.aspect = this.getRatio();
    this.camera.updateProjectionMatrix();
  }

  addEventOnResize() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  addCursorGrabbingOnClick() {
    this.renderer.domElement.addEventListener(
      "pointerdown",
      (event) => {
        event.target.style.cursor = "grabbing";
      }
    );
    this.renderer.domElement.addEventListener(
      "pointerup",
      (event) => {
        event.target.style.cursor = "grab";
      }
    );
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
  
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.01;
  
    this.renderer.render(this.scene, this.camera);
  }
}