import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

// Utility to check if the device is running iOS/Safari
function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Create a renderer and add it to the document, enable alpha
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);  // Ensure it scales for mobile devices
scene.background = new THREE.Color(0x000000); // Sets background to black
document.body.appendChild(renderer.domElement);

// Create a video element with multiple sources
const video = document.createElement('video');
video.loop = true;
video.muted = true;
video.playsInline = true;  // Important for mobile
video.autoplay = false;    // Autoplay disabled for Safari

// Add both .mp4 and .webm sources
const sourceMP4 = document.createElement('source');
sourceMP4.src = 'assets/ezgif.com-gif-to-mp4-converter(4).mp4';
sourceMP4.type = 'video/mp4';

const sourceWEBM = document.createElement('source');
sourceWEBM.src = 'assets/ezgif.com-gif-to-mp4-converter(4).webm';
sourceWEBM.type = 'video/webm';

// Append the sources to the video element
video.appendChild(sourceMP4);
video.appendChild(sourceWEBM);

// Force video play on user interaction (for Safari/iOS workaround)
function playVideoOnUserInteraction() {
  video.play().catch((e) => {
    console.error('Video playback failed:', e);
  });
  document.removeEventListener('click', playVideoOnUserInteraction);
  document.removeEventListener('touchstart', playVideoOnUserInteraction);
}

if (isIOS() || isSafari()) {
  // Listen for user interaction to start video playback
  document.addEventListener('click', playVideoOnUserInteraction);
  document.addEventListener('touchstart', playVideoOnUserInteraction);
} else {
  // For non-Safari, autoplay can be triggered normally
  video.autoplay = true;
  video.play();
}

// Fallback for static image if video fails to load
video.addEventListener('canplay', () => {
  const videoTexture = new THREE.VideoTexture(video);
  scene.background = videoTexture;
  video.play();
});

video.addEventListener('error', () => {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('assets/static-background-image.jpg', (texture) => {
    scene.background = texture;  // Fallback image
  });
});

// Add some ambient light and directional light for better material rendering
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Add OrbitControls to allow mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

// Set the min and max distance for the zoom
controls.minDistance = 5;  // Minimum distance the camera can zoom in
controls.maxDistance = 20; // Maximum distance the camera can zoom out

// Create confetti particles
function createConfetti() {
  const confettiGroup = new THREE.Group();
  const confettiCount = 500;
  const spread = 50;
  const colors = [0xff0000, 0x00ff00, 0x0000ff]; // Pure Red, Green, and Blue

  for (let i = 0; i < confettiCount; i++) {
    const geometry = new THREE.PlaneGeometry(0.3, 0.1);
    const material = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      side: THREE.DoubleSide,
    });
    const confetti = new THREE.Mesh(geometry, material);

    confetti.position.set(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    );

    confetti.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    confettiGroup.add(confetti);
  }

  scene.add(confettiGroup);
  return confettiGroup;
}

const confetti = createConfetti();

function animateConfetti() {
  confetti.children.forEach((piece) => {
    piece.position.y -= 0.02;
    if (piece.position.y < -25) {
      piece.position.y = 25;
    }
  });
}

// Animation function
function animateScene() {
  requestAnimationFrame(animateScene);
  controls.update();
  animateConfetti();
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
      object.rotation.x = -Math.PI / 2;
      scene.add(object);
      animateScene();
    });
  });
}


const objPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.obj';  // Update to your OBJ path
const mtlPath = 'https://raw.githubusercontent.com/bytebrawnoffical/website/main/assets/component.mtl';  // Update to your MTL path
loadOBJWithMTL(objPath, mtlPath);

// Create and animate the "Loading..." text dynamically
const loadingText = document.createElement('div');
loadingText.id = 'loading-text';
loadingText.style.position = 'absolute';
loadingText.style.bottom = '50px';
loadingText.style.width = '100%';
loadingText.style.fontSize = '24px';
loadingText.style.color = '#000000';
loadingText.style.textAlign = 'center';
loadingText.style.zIndex = '10';
loadingText.textContent = 'Loading';

// Append the loading text to the body
document.body.appendChild(loadingText);

// Animate the loading dots
let dotCount = 0;
setInterval(() => {
  dotCount = (dotCount + 1) % 4;  // Loop between 0 and 3 dots
  loadingText.textContent = 'Loading' + '.'.repeat(dotCount);
}, 500);  // Change every half second

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
