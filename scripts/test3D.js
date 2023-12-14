import * as THREE from "../node_modules/three/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

//Réglage des dimension de la fenetre 3D
renderer.setSize( 570, 400 );

//Emplacement de la fenetre 3D -- cube-rouge est ID d'affichage
const emplacement1 = document.getElementById('cube-rouge');
emplacement1.appendChild(renderer.domElement);

//  document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

//Affichage de l'objet 3D en fonction de son matériel. Plusieurs mode d'affichage existe comme MeshPhysicalMaterial.
//Le mode MeshBasicMaterial n'utilse que des couleurs primaire mais pas de texture.
//Le mode MeshPhysicalMaterial n'utilse que de texture et pour les voir il faut ajouter de la lumiere.
const material = new THREE.MeshBasicMaterial( { color: 0xe39700  } );

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

camera.position.z = 5;

function animate() {
	window.requestAnimationFrame( animate );
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();

console.log(test333D);
