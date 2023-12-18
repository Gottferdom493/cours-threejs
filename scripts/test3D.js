// import * as THREE from "../node_modules/three/build/three.module.js";
import * as THREE from "three";

// import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { OrbitControls } from "OrbitControls";


// import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "GLTFLoader";
const loader = new GLTFLoader();


// Permet le chargement du modéle

const box = document.querySelector(".grand-parent")


box.addEventListener('click',
  ()=>{
    console.log('click')

  })


const geometry = loader.load("../assets/gltf/Turbo-GLB.glb", (gltf) => {
  scene.add( gltf.scene );
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
const renderer2 = new THREE.WebGLRenderer();

//Permet de tourner et de déplacer l'objet avec la sourie
const controls = new OrbitControls( camera, renderer.domElement );

//Réglage des dimensions de la page 3D
renderer.setSize(  window.innerWidth,  window.innerHeight );
renderer2.setSize( 500, 300 );

//Permet de ranger l'affichage 3D dans un ID
const emplacement = document.getElementById('cube-rouge');
const secondEmplacement = document.getElementById('cube-vert');

emplacement.appendChild(renderer.domElement);
secondEmplacement.appendChild(renderer2.domElement);
//  document.body.appendChild( renderer.domElement );

//Ligne de commande pour afficher le cube jaune qui tourne
// const geometry = new THREE.BoxGeometry( 0, 0, 0 );

//Affichage de l'objet 3D en fonction de son matériel. Plusieurs mode d'affichage existe comme MeshPhysicalMaterial.
//Le mode MeshBasicMaterial n'a pas besoin de lumiere car il n'utilse que des couleurs primaire mais pas de texture.
//Le mode MeshPhysicalMaterial n'utilse que de texture et pour les voir il faut ajouter de la lumiere.
const material = new THREE.MeshPhysicalMaterial( { color: 0xe39700  } );

// Modification de la couleur de l'arriére plan
scene.background = new THREE.Color(0xADADAD);

//Ajout de l'élément lumière (ampoule)
const ambientLight = new THREE.AmbientLight(0xffffff);
// const spotLight1 = new THREE.SpotLight( 0xffffff );
// spotLight1.position.set( 0, 50, 0 );
// const spotLight2 = new THREE.SpotLight( 0xffffff );
// spotLight2.position.set( 0, -50, 0 );
// const spotLight3 = new THREE.SpotLight( 0xffffff );
// spotLight3.position.set( 50, 0, 0 );
// const spotLight4 = new THREE.SpotLight( 0xffffff );
// spotLight4.position.set( -50, 0, 0 );
// const spotLight5 = new THREE.SpotLight( 0xffffff );
// spotLight5.position.set( 50, 0, 70 );
const spotLight6 = new THREE.SpotLight( 0xffffff );
spotLight6.position.set( -10, 0, 5 );
// const light = new THREE.DirectionalLight( 0xFFFFFF );


// Ajout de l'élément lumiére dans la scéne (intérupteur)
scene.add(ambientLight)
// scene.add(spotLight1)
// scene.add(spotLight2)
// scene.add(spotLight3)
// scene.add(spotLight4)
// scene.add(spotLight5)
scene.add(spotLight6)
// scene.add(light)


const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

camera.position.z = 5;

function animate() {
	window.requestAnimationFrame( animate );
  //Commande pour la rotation du cube jaune
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
  renderer2.render( scene, camera );

}
animate();

console.log(test333D);
