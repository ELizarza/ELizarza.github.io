// Importing OrbitControls (make sure the path matches the version you are using)
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

const viewDepthMap = true;

let camera, scene, renderer, clock;
let object;
let groupGuy, groupHouse, groupCoffin;
let spotLight;
let t = 0;
init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20);
	camera.position.z = 2.5;

	// scene
	scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight(0x404040, 3.2);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, .8);
	directionalLight.position.set(-5, 1, 0).normalize();
	directionalLight.castShadow = true;
	//scene.add(directionalLight);

	const secondaryLight = new THREE.SpotLight(0xffffff, .8);
	secondaryLight.position.set(-5, 1, 1);
	secondaryLight.castShadow = true;
	secondaryLight.penumbra = 0.3;
	secondaryLight.shadow.camera.near = 1;
	secondaryLight.shadow.camera.far = 10;
	secondaryLight.shadow.mapSize.width = 1024;
	secondaryLight.shadow.mapSize.height = 1024;
	scene.add(secondaryLight);

	const dirLight = new THREE.DirectionalLight(0xffffff, .25);
	dirLight.name = 'Dir. Light';
	dirLight.position.set(0, 10, 0);
	dirLight.castShadow = true;
	dirLight.shadow.camera.near = 1;
	dirLight.shadow.camera.far = 10;
	dirLight.shadow.camera.right = 15;
	dirLight.shadow.camera.left = - 15;
	dirLight.shadow.camera.top = 15;
	dirLight.shadow.camera.bottom = - 15;
	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	scene.add(dirLight);

	spotLight = new THREE.SpotLight(0xffffff, .8);
	spotLight.name = 'Spot Light';
	//spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.3;
	spotLight.position.set(1, 3, 5);
	spotLight.castShadow = true;
	//spotLight.shadow.camera.near = 8;
	//spotLight.shadow.camera.far = 30;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add(spotLight);

	//scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
	//scene.add(new THREE.CameraHelper(secondaryLight.shadow.camera));
	//scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

	const envMaploader = new THREE.CubeTextureLoader();
	const environmentMap = envMaploader.load([
		'textures/Bridge2/posx.jpg', 'textures/Bridge2/negx.jpg',
		'textures/Bridge2/posy.jpg', 'textures/Bridge2/negy.jpg',
		'textures/Bridge2/posz.jpg', 'textures/Bridge2/negz.jpg'
	]);
	scene.environment = environmentMap;
	scene.background = environmentMap;

	
	const textureMap = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg');
	const textureMaterial = new THREE.MeshStandardMaterial({ map: textureMap });
	

	/*
	const bunnyTexture = new THREE.TextureLoader().load('models/bunTexture.png');
	const bunnyMaterial = new THREE.MeshStandardMaterial({ map: bunnyTexture });
	*/

	// Create a metallic material with a gold tint
	const metalMaterial = new THREE.MeshStandardMaterial({
		color: 0xFFD700, // Gold color
		metalness: 0.9, // Fully metallic
		roughness: 0.1, // A bit of roughness to simulate gold's reflectivity
	});

	const matteMaterial = new THREE.MeshStandardMaterial({
		color: 0xFFD700, // Gold color
		metalness: 0.0,
		roughness: 0.9,
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

	let shadowMaterial = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		shininess: 150,
		specular: 0x222222
	});

	const geometry = new THREE.BoxGeometry(10, 0.15, 10);
	const material = new THREE.MeshPhongMaterial({
		color: 0xa0adaf,
		shininess: 150,
		specular: 0x111111
	});

	const ground = new THREE.Mesh(geometry, material);
	ground.scale.multiplyScalar(5);
	ground.position.set(0, -1, 0)
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add(ground);

	const loader = new OBJLoader();
	// model
	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			//console.log('model ' + percentComplete.toFixed(2) + '% downloaded');
		}
	}
	function onError() { }

	loader.load('models/little_guy.obj', function (object) {

		// attach material
		object.traverse(function (child) {
			if (child.isMesh) {
				child.material = metalMaterial; // Apply the material to each mesh
				child.castShadow = true;
				child.receiveShadow = true;
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
		groupGuy =  new THREE.Group();
		groupGuy.add(object);
		scene.add(groupGuy);
		render();
	}, onProgress, onError);

	loader.load('models/coffin.obj', function (object) {

		// attach material
		object.traverse(function (child) {
			if (child.isMesh) {
				child.material = metalMaterial; // Apply the material to each mesh
				child.receiveShadow = true;
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
		object.position.set(-0.35, 0, -0.5);
		object.scale.set(1.5, 1.5);
		render();
	}, onProgress, onError);

	loader.load('models/house.obj', function (object) {

		// attach material
		object.traverse(function (child) {
			if (child.isMesh) {
				child.material = shadowMaterial; // Apply the material to each mesh
				child.receiveShadow = true;
				child.castShadow = true;
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
		object.rotation.x = 3 * Math.PI/2;
		object.rotation.z = Math.PI;
		object.position.set(1, 0, 0);
		object.castShadow = true;
		object.recieveShadow = true;
		groupHouse = new THREE.Group();
		groupHouse.add(object);
		scene.add(groupHouse);
		render();
	}, onProgress, onError);

	

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	window.addEventListener('resize', onWindowResize);

	clock = new THREE.Clock();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function renderScene() {
	renderer.render(scene, camera);
}

function render() {
	const delta = clock.getDelta();
	t += 1 * delta;

	groupGuy.rotation.y += 0.5 * delta
	groupHouse.position.y = 0.25 * (Math.sin(t)) + .25
	//console.log(delta);
	//console.log(t);
	renderScene();



}
