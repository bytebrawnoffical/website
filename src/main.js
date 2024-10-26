import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

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

// Add some ambient light and directional light for better material rendering
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Add OrbitControls to allow mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Adds smooth damping when rotating
controls.dampingFactor = 0.05;
controls.enableZoom = true;     // Allows zooming in and out

// Remove rotation limits to allow full 360° rotation
controls.minPolarAngle = 0;   // Allow full vertical rotation
controls.maxPolarAngle = Math.PI; // No limits on vertical spin
controls.enablePan = true;    // Enable panning
controls.autoRotate = true;   // Enable automatic rotation
controls.autoRotateSpeed = 2; // Auto-rotate speed

// Animation function
function animate(object) {
  requestAnimationFrame(() => animate(object));

  controls.update();  // Update controls every frame
  renderer.render(scene, camera);
}

// Function to load OBJ model with MTL material support and override with standard material
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

          // Final small adjustment to make it perfectly upright
          object.rotation.x = -Math.PI / 2;  // Slightly adjusted for final upright position

          // Apply MeshStandardMaterial to handle lighting and material properties
          const customMaterial = new THREE.MeshStandardMaterial({
            color: 0xff5c00,  // Lighter, more vibrant orange color
            metalness: 0.1,   // Reduce metalness to make it less reflective
            roughness: 0.5    // Reduce roughness to make the surface smoother and brighter
          });

          object.traverse((child) => {
            if (child.isMesh) {
              child.material = customMaterial;
            }
          });

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
                object.rotation.x = -Math.PI / 2.8;  // Adjust fallback model's initial rotation as well
                const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0xffd1a1, metalness: 0.2, roughness: 0.3 });  // Fallback material
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
