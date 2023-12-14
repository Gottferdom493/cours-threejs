import * as THREE from "../../node_modules/three/build/three.module.js";

export default class Scene {
    constructor(idCanvas, classDiv) {
        this.divCanvas = document.querySelector("classDiv");

        this.createScene();
        this.createCamera();
        this.createRenderer(idCanvas);
        this.createObjects();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
    }

    createRenderer(idCanvas) {
        // const canvas = document.getElementById(idCanvas);
        // const divLuke = document.querySelector(".luke");
        // console.log(divLuke.innerWidth)
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.renderer.setSize( this.divCanvas.clientWidth, this.divCanvas.clientHeight );
        // document.body.appendChild( this.renderer.domElement );
        const personnages = document.getElementById('div-canvas-vador');
        personnages.appendChild(renderer.domElement);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera( 50, this.divCanvas.clientWidth / this.divCanvas.clientHeight, 0.1, 1000 );
        this.camera.position.z = 10;
    }

    createLights() {

    }

    createObjects() {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xe39700  } );

        this.mesh = new THREE.Mesh( geometry, material );
        this.scene.add( this.mesh );
    }

    animate() {
        window.requestAnimationFrame( this.animate.bind(this) );
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.01;
        this.renderer.render( this.scene, this.camera );
    }
}
