// Importing OrbitControls (make sure the path matches the version you are using)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, clock;
let object;
let t = 0;
let rotationGroup;
var myContainerElement = document.getElementById("branding");
let myObject;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, myContainerElement.offestWidth / myContainerElement.offsetHeight, 0.1, 20);
    camera.position.z = 1.125;

    // scene
    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xcccccc, 7.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 12);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    
    const textureMap = new THREE.TextureLoader().load('Week4/textures/uv_grid_opengl.jpg');
    const textureMaterial = new THREE.MeshStandardMaterial({ map: textureMap });
    

    // Create a metallic material with a gold tint
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x001B2E, // dark purple
        metalness: 0.9, // Fully metallic
        roughness: 0.6 // A bit of roughness to simulate gold's
    });

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
        // resource URL
        'NameTitleCard/Models/NameTitle_Updated.glb',
        // called when the resource is loaded
        function ( gltf ) {

            gltf.scene.traverse((o) => {
                if (o.isMesh) o.material = metalMaterial;
            });

            // Calculate the bounding box to get model size and center
            const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
            // Center the model
            const center = boundingBox.getCenter(new THREE.Vector3());
            // Scale the model to a unit scale and center it to (0,0,0)
            const size = boundingBox.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scale = 1.27 / maxDimension;
            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

            scene.add( gltf.scene );

            myObject = gltf.scene;
            // myObject.position.set(0.25,0,0);
            // myObject.scale.x = 0.125;
            myObject.rotation.set(0.5 * Math.PI, 0, 0);

            render();

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(myContainerElement.offsetWidth, myContainerElement.offsetHeight);
    renderer.setClearColor(0x769FB6, 1);
    myContainerElement.appendChild(renderer.domElement);
    //document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.enablePan = false
    window.addEventListener('resize', onWindowResize);
    clock = new THREE.Clock();
    // controls.autoRotate = true;
    

    camera.aspect = myContainerElement.offsetWidth / myContainerElement.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(myContainerElement.offsetWidth, myContainerElement.offsetHeight);
}

function onWindowResize() {
    camera.aspect = myContainerElement.offsetWidth / myContainerElement.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(myContainerElement.offsetWidth, myContainerElement.offsetHeight);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}

function renderScene() {
    renderer.render(scene, camera);
}

function render() {
    const delta = clock.getDelta();
    t += 1 * delta;
    myObject.rotation.z += 0.5 * delta;
    //console.log(rotationGroup.rotation);
    renderScene();
}





