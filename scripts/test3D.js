// import * as THREE from "../node_modules/three/build/three.module.js";
import * as THREE from "three";

// import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "GLTFLoader";
const loader = new GLTFLoader();

loader.load("../assets/gltf/Turbo-GLB.glb", (gltf) => {
  scene.add( gltf.scene );
});

// Load a glTF resource
	// called when the resource is loaded
// 	function ( gltf ) {


// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened' );

// 	}
// );



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
const renderer2 = new THREE.WebGLRenderer();


renderer.setSize( 500, 300 );
renderer2.setSize( 500, 300 );

const emplacement = document.getElementById('cube-rouge');
const secondEmplacement = document.getElementById('cube-vert');

emplacement.appendChild(renderer.domElement);
secondEmplacement.appendChild(renderer2.domElement);
//  document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 0, 0, 0 );

//Affichage de l'objet 3D en fonction de son matériel. Plusieurs mode d'affichage existe comme MeshPhysicalMaterial.
//Le mode MeshBasicMaterial n'a pas besoin de lumiere car il n'utilse que des couleurs primaire mais pas de texture.
//Le mode MeshPhysicalMaterial n'utilse que de texture et pour les voir il faut ajouter de la lumiere.
const material = new THREE.MeshPhysicalMaterial( { color: 0xe39700  } );

//Ajout de la lumière dans la scéne
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight)



const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

camera.position.z = 5;

function animate() {
	window.requestAnimationFrame( animate );
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
  renderer2.render( scene, camera );

}
animate();

console.log(test333D);
