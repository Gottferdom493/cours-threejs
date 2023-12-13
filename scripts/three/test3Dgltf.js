import { GLTFLoader } from '../../node_modules/three/examples/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

loader.load(
    '../../assets/gltf/Turbo-GLTF.gltf',
    function ( gltf ) {
        scene.add( gltf.scene );
        
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
    function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
    function ( error ) {

		console.log( 'An error happened' );

	}
);