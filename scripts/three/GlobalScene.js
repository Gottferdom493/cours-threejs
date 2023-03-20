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
  constructor({
    jeu,
    idCanvas,
    divCanvasCssSelector,
    gltfPersonnages,
    colorLights,
    isOrbitControls,
    cameraCoordonnees = { x: 0, y: 2, z: 6 },
    cameraCoordonneesMobile = { x: 0, y: 2, z: 6 }
  }) {
    this.jeu = jeu;
    this.divCanvas = document.querySelector(divCanvasCssSelector);
    this.idCanvas = idCanvas;
    this.gltfPersonnages = gltfPersonnages;
    this.personnages3D = {};
    this.cameraCoordonnees = cameraCoordonnees;
    this.cameraCoordonneesMobile = cameraCoordonneesMobile;

    this.sizeMobile = 700;

    this.createScene();
    this.createCamera();
    this.createRenderer(idCanvas);
    if (isOrbitControls) {
      this.createControls();
      this.addCursorGrabbingOnClick();
    }
    this.loadAsyncResources(divCanvasCssSelector);
    this.createLights(colorLights);
    this.addEventOnResize();
    this.animate();
  }

  async loadAsyncResources(divCanvasCssSelector) {
    this.loader = new Loader(divCanvasCssSelector);
    this.loader.add();
    const texture = await this.createCubeTexture();
    this.createObjects(texture);
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
    if (window.innerWidth < this.sizeMobile) {
      this.setCameraPositionMobile();
    } else {
      this.setCameraPosition();
    }
  }

  setCameraPositionMobile() {
    this.camera.position.z = this.cameraCoordonneesMobile.z;
    this.camera.position.y = this.cameraCoordonneesMobile.y;
    this.camera.position.x = this.cameraCoordonneesMobile.x;
  }

  setCameraPosition() {
    this.camera.position.z = this.cameraCoordonnees.z;
    this.camera.position.y = this.cameraCoordonnees.y;
    this.camera.position.x = this.cameraCoordonnees.x;
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
    this.objectsLoaded = 0;
    for (let personnage of this.gltfPersonnages) {
      this.personnages3D[personnage.name] = new Personnage3D({
        globalScene: this,
        gltfPath: personnage.gltf,
        cubeTexture: texture,
        coordonnees: personnage.coordonnees,
        coordonneesMobile: personnage.coordonneesMobile,
        rotation: personnage.rotation,
        initAnimation: personnage.initAnimation,
        needChangeColorSaber: personnage.needChangeColorSaber
      });
    }
  }

  onceGltfAreLoaded() {
    if (this.gltfPersonnages.length === this.objectsLoaded) {
      this.loader.remove();
      if (this.jeu) {
        this.jeu.personnage.activerTousLesBoutons();
      }
    }
  }

  setPositionsPersonnage() {
    for (let key of Object.keys(this.personnages3D)) {
      if (window.innerWidth < this.sizeMobile) {
        this.personnages3D[key].setPositionMobileVersion();
      } else {
        this.personnages3D[key].setPositionLaptopVersion();
      }
    }
  }

  onResize(event) {
    this.setSizeRenderer();
    this.camera.aspect = this.getRatio();
    this.camera.updateProjectionMatrix();
    if (event.target.innerWidth < this.sizeMobile) {
      this.setCameraPositionMobile();
    } else {
      this.setCameraPosition();
    }
    this.setPositionsPersonnage();
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