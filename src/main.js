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

// Animation function
function animate(object) {
  requestAnimationFrame(() => animate(object));
  object.rotation.x += 0.01;
  object.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Function to load OBJ model and handle fallbacks
const loadOBJModel = (primaryPath, fallbackPath) => {
  const objLoader = new OBJLoader();

  objLoader.load(
    primaryPath,
    (object) => {
      object.scale.set(0.5, 0.5, 0.5);  // Scale the model as needed
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
