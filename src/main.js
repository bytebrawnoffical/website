import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer and add it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add some ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Soft white light
scene.add(ambientLight);

// Function to load OBJ model and handle fallbacks
const loadOBJModel = (primaryPath, fallbackPath) => {
  const objLoader = new OBJLoader();
  
  // First, try loading from the primary path
  objLoader.load(
    primaryPath,
    (object) => {
      object.scale.set(0.5, 0.5, 0.5);  // Scale the model as needed
      scene.add(object);
      
      // Animation loop to rotate the object
      function animate() {
        requestAnimationFrame(animate);
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
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
            object.scale.set(0.5, 0.5, 0.5);  // Scale the model as needed
            scene.add(object);

            // Animation loop to rotate the object
            function animate() {
              requestAnimationFrame(animate);
              object.rotation.x += 0.01;
              object.rotation.y += 0.01;
              renderer.render(scene, camera);
            }
            animate();
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

// Load your custom OBJ model with fallback path
loadOBJModel('/website/assets/Logo1.obj', '/assets/Logo1.obj');

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
