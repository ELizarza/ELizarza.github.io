// Importing OrbitControls (make sure the path matches the version you are using)
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

// Creating the scene
var scene = new THREE.Scene();

// Creating the camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Creating the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add light.
const directionLight = new THREE.DirectionalLight(0xffffff, 3)
//directionLight.position.set(0, 0, 2)
scene.add(directionLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // white light at 50% intensity
scene.add(ambientLight)

//textures
const material = new THREE.MeshPhongMaterial();
//const displacementMaterial = new THREE.MeshPhongMaterial();

const bumpTexture = new THREE.TextureLoader().load('Week3EarthImg/earth_bumpmap.jpg');
material.bumpMap = bumpTexture;
material.bumpScale = 0.05;
//displacementMaterial.displacementMap = bumpTexture;
//displacementMaterial.displacementScale = 0.15;

const geometrySphere = new THREE.SphereGeometry(2, 100, 100);
const texture = new THREE.TextureLoader().load('Week3EarthImg/worldColour.5400x2700.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
material.map = texture;
//displacementMaterial.map = texture;

const sphere = new THREE.Mesh(geometrySphere, material);
scene.add(sphere);
//sphere.position.x = 1;

const sunMaterial = new THREE.MeshBasicMaterial({ color: 'yellow'} );
const sunGeometry = new THREE.SphereGeometry(1, 8, 50);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const group = new THREE.Group();
scene.add(group);
group.add(sun);
group.add(directionLight);

//group.position.set(0, 0, 2);



//planes group
const geometryPlane = new THREE.PlaneGeometry(10, 10);
//const materialPlane = new THREE.MeshPhongMaterial();
const SpaceTexture = new THREE.TextureLoader().load('Week3EarthImg/nz_eso0932a.jpg');
SpaceTexture.colorSpace = THREE.SRGBColorSpace;
const materialPlane = new THREE.MeshBasicMaterial( {map: SpaceTexture} );
//materialPlane.map = SpaceTexture;

const farSpace = new THREE.Mesh(geometryPlane, materialPlane);
scene.add(farSpace);
farSpace.position.z = -80;
//farSpace.scale.set(10, 10);


const leftSpace = new THREE.Mesh(geometryPlane, materialPlane);
scene.add(leftSpace);
leftSpace.position.x = -80;
leftSpace.rotation.y = Math.PI / 2;

const rightSpace = new THREE.Mesh(geometryPlane, materialPlane);
scene.add(rightSpace);
rightSpace.position.x = 80;
rightSpace.rotation.y = 3 * (Math.PI / 2);

const bSpace = new THREE.Mesh(geometryPlane, materialPlane);
scene.add(bSpace);
bSpace.position.z = 80;
bSpace.rotation.y = Math.PI;


const spaceGroup = new THREE.Group();
scene.add(spaceGroup);
spaceGroup.add(farSpace);
spaceGroup.add(leftSpace);
farSpace.scale.set(20, 20);
leftSpace.scale.set(20, 20);
rightSpace.scale.set(20, 20);
bSpace.scale.set(20, 20);



// Adding OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);

// Adjust control settings if needed
controls.minDistance = 1;
controls.maxDistance = 10;
controls.enablePan = true;
//controls.autoRotate = true;
controls.enableDamping = true;

var t = 0.0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    t += 0.01
    group.position.x = 15 * Math.sin(t);
    group.position.z = 15 * Math.cos(t);

    // Required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    // Rendering the scene
    renderer.render(scene, camera);
}

animate();