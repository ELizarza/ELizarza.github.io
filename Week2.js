// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

//torus
const geometryTorus = new THREE.TorusGeometry(.8, 0.2, 16, 100);
const materialTorus = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const torus = new THREE.Mesh(geometryTorus, materialTorus);
scene.add(torus);

//sphere
const geometrySphere = new THREE.SphereGeometry();
const materialSphere = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
scene.add(sphere);

//cone
const geometryCone = new THREE.ConeGeometry(.4, 1.2, 20, 100);
const materialCone = new THREE.MeshBasicMaterial({ color: 0x22332f} );
const cone = new THREE.Mesh(geometryCone, materialCone);
scene.add(cone);

//use group
const group = new THREE.Group();
scene.add(group);

group.add(cube)
group.add(torus)
group.add(sphere)
group.add(cone)
group.scale.set(1.5, 2, 1.5)
sphere.scale.set(.5, .4, .5)
cube.position.set(0, 0.0, -0.75)
cone.rotation.set((Math.PI/2), 0, 0)
cone.position.z = 0.5

t = 0.0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    group.rotation.x += 0.01;
    group.rotation.y += 0.01;
    t += 0.025;
    sphere.position.x = 2.0 * Math.sin(t);
    sphere.position.y = 1.5 * Math.cos(t);

    renderer.render(scene, camera);
}

animate();