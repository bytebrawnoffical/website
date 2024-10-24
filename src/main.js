import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer and add it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the texture
const textureLoader = new THREE.TextureLoader();

// Attempt to load the texture
textureLoader.load(
  '/assets/template.jpg',  // Adjust this path to the actual location of your image
  (texture) => {
    // On successful load, apply the texture to the cube
    const materials = [
      new THREE.MeshBasicMaterial({ map: texture }),
      new THREE.MeshBasicMaterial({ map: texture }),
      new THREE.MeshBasicMaterial({ map: texture }),
      new THREE.MeshBasicMaterial({ map: texture }),
      new THREE.MeshBasicMaterial({ map: texture }),
      new THREE.MeshBasicMaterial({ map: texture }),
    ];

    // Create the cube with the texture on each side
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, materials);

    // Scale the cube by 120%
    cube.scale.set(2, 2, 2);  // Makes the cube 120% bigger along all axes

    scene.add(cube);

    // Animation loop to rotate the cube
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,  // Optional loading progress callback
  (error) => {
    console.error('An error occurred while loading the texture:', error);

    // Fallback: Create a cube with different colored sides if the texture fails to load
    const fallbackMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),  // Red
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),  // Green
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),  // Blue
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),  // Yellow
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),  // Cyan
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),  // Magenta
    ];

    // Create the cube with fallback colors
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, fallbackMaterials);

    // Scale the cube by 120% (in case the fallback cube needs to be bigger too)
    cube.scale.set(1.2, 1.2, 1.2);

    scene.add(cube);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }
);

// Adjust scene on window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
