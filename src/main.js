import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Create a renderer and add it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xe5904f);  // Set background color to #e5904f
document.body.appendChild(renderer.domElement);

// Add some ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Function to apply material to the OBJ model
const applyMaterial = (object, color) => {
  const material = new THREE.MeshBasicMaterial({ color: color });
  object.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });
};

// Animation function
function animate(object) {
  requestAnimationFrame(() => animate(object));
  object.rotation.y += 0.005;  // Slow and gentle rotation on Y-axis
  object.rotation.z += 0.004;  // Slow and gentle rotation on Y-axis
  renderer.render(scene, camera);
}

// Function to load OBJ model and handle fallbacks
const loadOBJModel = (primaryPath, fallbackPath) => {
  const objLoader = new OBJLoader();

  // Try loading the primary path first
  objLoader.load(
    primaryPath,
    (object) => {
      object.scale.set(0.8, 0.8, 0.8);
      object.rotation.x = Math.PI / 2;  // Make the logo stand upright
      applyMaterial(object, 0xee5535);  // Apply new color #ee5535 to the model
      scene.add(object);
      animate(object);
    },
    undefined,
    (error) => {
      console.error('Error loading the OBJ model from primary path:', error);

      // Fallback: Try loading from the secondary path
      if (fallbackPath) {
        console.log(`Trying fallback path: ${fallbackPath}`);
        objLoader.load(
          fallbackPath,
          (object) => {
            object.scale.set(0.5, 0.5, 0.5);
            object.rotation.x = Math.PI / 2;  // Make the logo stand upright for fallback model as well
            applyMaterial(object, 0xedccbb);  // Apply fallback color
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

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
