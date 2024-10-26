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
controls.autoRotate = true;     // Enable automatic rotation
controls.autoRotateSpeed = 2;   // Auto-rotate speed

// Create confetti particles
function createConfetti() {
  const confettiGroup = new THREE.Group();
  const confettiCount = 500;  // Number of confetti pieces
  const spread = 50;          // How far confetti spreads across the scene

  const colors = [0xff0000, 0x00ff00, 0x0000ff];  // Pure Red, Green, and Blue

  for (let i = 0; i < confettiCount; i++) {
    const geometry = new THREE.PlaneGeometry(0.3, 0.1);  // Small rectangle shape for confetti
    const material = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],  // Random RGB color
      side: THREE.DoubleSide
    });
    const confetti = new THREE.Mesh(geometry, material);

    // Position confetti randomly in 3D space
    confetti.position.set(
      (Math.random() - 0.5) * spread,  // Random X
      (Math.random() - 0.5) * spread,  // Random Y
      (Math.random() - 0.5) * spread   // Random Z
    );

    // Random rotation for each confetti
    confetti.rotation.set(
      Math.random() * Math.PI,  // Random X rotation
      Math.random() * Math.PI,  // Random Y rotation
      Math.random() * Math.PI   // Random Z rotation
    );

    confettiGroup.add(confetti);
  }

  scene.add(confettiGroup);
  return confettiGroup;
}

// Create confetti and animate it
const confetti = createConfetti();

function animateConfetti() {
  confetti.children.forEach((piece) => {
    piece.position.y -= 0.02;  // Slowly move confetti downwards
    if (piece.position.y < -25) {
      piece.position.y = 25;   // Reset position to top when confetti goes below the scene
    }
  });
}

// Animation function
function animateScene() {
  requestAnimationFrame(animateScene);

  controls.update();         // Update controls every frame
  animateConfetti();         // Animate confetti
  renderer.render(scene, camera);
}

// Load the OBJ model (your logo)
function loadOBJWithMTL(objPath, mtlPath) {
  const mtlLoader = new MTLLoader();
  mtlLoader.load(mtlPath, (materials) => {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(objPath, (object) => {
      object.scale.set(0.8, 0.8, 0.8);
      object.rotation.x = -Math.PI / 2;  // Adjust to make it upright
      scene.add(object);
      animateScene();  // Start the animation
    });
  });
}

// Load the custom OBJ model with MTL
const objPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.obj';
const mtlPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.mtl';
loadOBJWithMTL(objPath, mtlPath);

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
