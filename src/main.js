import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/MTLLoader.js';

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

// Animation function
function animate(object) {
  requestAnimationFrame(() => animate(object));
  object.rotation.y += 0.005;  // Slow and gentle rotation on Y-axis
  object.rotation.z += 0.004;  // Slow and gentle rotation on Z-axis
  renderer.render(scene, camera);
}

// Function to load OBJ model with MTL material support
const loadOBJWithMTL = (objPath, mtlPath, fallbackObjPath) => {
  const mtlLoader = new MTLLoader();

  // Load the MTL file first
  mtlLoader.load(
    mtlPath,
    (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);

      // Load the OBJ file
      objLoader.load(
        objPath,
        (object) => {
          object.scale.set(0.8, 0.8, 0.8);
          object.rotation.x = Math.PI / 2;  // Make the logo stand upright
          scene.add(object);
          animate(object);
        },
        undefined,
        (error) => {
          console.error('Error loading the OBJ model with MTL:', error);

          // Fallback: Try loading from the fallback OBJ path without MTL
          if (fallbackObjPath) {
            console.log(`Trying fallback OBJ path: ${fallbackObjPath}`);
            objLoader.load(
              fallbackObjPath,
              (object) => {
                object.scale.set(0.5, 0.5, 0.5);
                object.rotation.x = Math.PI / 2;  // Make the fallback model stand upright
                const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xedccbb });  // Fallback color
                object.traverse((child) => {
                  if (child.isMesh) {
                    child.material = fallbackMaterial;
                  }
                });
                scene.add(object);
                animate(object);
              },
              undefined,
              (error) => {
                console.error('Error loading the fallback OBJ model:', error);
              }
            );
          }
        }
      );
    },
    (error) => {
      console.error('Error loading MTL file:', error);
    }
  );
};

// Use the raw GitHub URL for the primary OBJ and MTL paths
const objPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.obj';
const mtlPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.mtl';

// Load the custom OBJ model with MTL and fallback paths
loadOBJWithMTL(objPath, mtlPath, '/website/assets/component.obj');

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
