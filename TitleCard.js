// Importing OrbitControls (make sure the path matches the version you are using)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

let camera, scene, renderer, clock;
let object;
let t = 0;
let rotationGroup;
var myContainerElement = document.getElementById("branding");

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, myContainerElement.offestWidth / myContainerElement.offsetHeight, 0.1, 20);
    camera.position.z = 1.125;

    // scene
    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xcccccc, 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 7.2);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    
    const textureMap = new THREE.TextureLoader().load('Week4/textures/uv_grid_opengl.jpg');
    const textureMaterial = new THREE.MeshStandardMaterial({ map: textureMap });
    

    // Create a metallic material with a gold tint
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x571b3d, // dark purple
        metalness: 0.9, // Fully metallic
        roughness: 0.3 // A bit of roughness to simulate gold's reflectivity
    });

    const matteMaterial = new THREE.MeshStandardMaterial({
        color: 0x571b3d, // dark purple
        metalness: 0.0,
        roughness: 0.9
    });

    const glassmaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // Adjust the color as needed
        metalness: 0, // Glass is not metallic
        roughness: 0, // Smooth surface
        transmission: 1, // 0 is fully opaque, 1 is fully transparent (glass-like)
        transparent: true, // Enable transparency
        reflectivity: 1, // Adjust for the level of reflectivity
        refractionRatio: 0.9, // Adjust for the level of refraction
    });

    const loader = new OBJLoader();
    // model
    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + percentComplete.toFixed(2) + '% downloaded');
        }
    }
    function onError() { 
        console.log('model failed to load');
    }

    loader.load('NameTitleCard/Models/EDDIE.obj', function (object) {

        // attach material
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material = metalMaterial; // Apply the material to each mesh
            }
        });

        // Calculate the bounding box to get model size and center
        const boundingBox = new THREE.Box3().setFromObject(object);
        // Center the model
        const center = boundingBox.getCenter(new THREE.Vector3());
        // Scale the model to a unit scale and center it to (0,0,0)
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 1.0 / maxDimension;
        object.scale.set(scale, scale, scale);
        object.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

        // Add the model to the scene
        scene.add(object);
        object.position.set(0, 0, 0.5);
        rotationGroup = new THREE.Group();
        rotationGroup.add(object);
        render();
    }, onProgress, onError);

    loader.load('NameTitleCard/Models/LIZARZABURU.obj', function (object) {

        // attach material
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material = metalMaterial; // Apply the material to each mesh
            }
        });

        // Calculate the bounding box to get model size and center
        const boundingBox = new THREE.Box3().setFromObject(object);
        // Center the model
        const center = boundingBox.getCenter(new THREE.Vector3());
        // Scale the model to a unit scale and center it to (0,0,0)
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 1.0 / maxDimension;
        object.scale.set(scale, scale, scale);
        object.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

        // Add the model to the scene
        scene.add(object);
        object.position.set(0, -0.25, .5);
        rotationGroup.add(object);
        rotationGroup.scale.set(1, 1, 1.125);
        rotationGroup.position.z = -0.125
        rotationGroup.rotation.set(0, 3*(Math.PI/2), 0);
        scene.add(rotationGroup);
        render();
    }, onProgress, onError);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(myContainerElement.offsetWidth, myContainerElement.offsetHeight);
    renderer.setClearColor(0x769FB6, 1);
    myContainerElement.appendChild(renderer.domElement);
    //document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    window.addEventListener('resize', onWindowResize);
    clock = new THREE.Clock();
    controls.autoRotate = true;

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
    //controls.update();
}

function renderScene() {
    renderer.render(scene, camera);
}

function render() {
    const delta = clock.getDelta();
    t += 1 * delta;
    rotationGroup.rotation.y += 0.75 * delta; 
    //console.log(rotationGroup.rotation);
    renderScene();
}





