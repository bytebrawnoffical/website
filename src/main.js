import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;  // Adjust based on model size

// Create a renderer and add it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add some ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Soft white light
scene.add(ambientLight);

// Function to apply material to the OBJ model
const applyMaterial = (object, color) => {
  const material = new THREE.MeshPhongMaterial({ color: color });  // Use a MeshPhongMaterial for color and light interaction

  object.traverse((child) => {
    if (child.isMesh) {
      child.material = material;  // Apply the material to all mesh objects
    }
  });
};

// Animation function
function animate(object) {
  requestAnimationFrame(() => animate(object));
  object.rotation.y += 0.01;
  object.rotation.x += 0.01;
  object.rotation.z+= 0.01;

  renderer.render(scene, camera);
}

// Function to load OBJ model and handle fallbacks
const loadOBJModel = (primaryPath, fallbackPath) => {
  const objLoader = new OBJLoader();

  objLoader.load(
    primaryPath,
    (object) => {
      object.scale.set(0.8, 0.8, 0.8);  // Scale the model as needed
      applyMaterial(object, 0xeb5434);  // Apply the color #eb5434 to the model
      scene.add(object);
      animate(object);
    },
    undefined,
    (error) => {
      console.error('Error loading the OBJ model from primary path:', error);
      if (fallbackPath) {
        console.log(`Trying fallback path: ${fallbackPath}`);
        objLoader.load(
          fallbackPath,
          (object) => {
            object.scale.set(0.5, 0.5, 0.5);
            applyMaterial(object, 0xedccbb);  // Apply the color #eb5434 to the fallback model
            scene.add(object);
            animate(object);
          },
          undefined,
          (error) => {
            console.error('Error loading the OBJ model from fallback path:', error);
          }
        );
      }
    }
  );
};

// Use the raw GitHub URL for the primary path
const primaryPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/logo.obj';

// Load your custom OBJ model with fallback paths
loadOBJModel(primaryPath, '/website/assets/logo.obj');

// If the fallback also fails, use an additional fallback:
loadOBJModel('/website/assets/logo.obj', '/assets/logo.obj');

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
