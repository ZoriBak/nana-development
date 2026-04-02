
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, model;
export let selectedParts = [];

init();

function init() {
    const container = document.getElementById('canvas-container');

   
    scene = new THREE.Scene();

    
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.5, 4);

    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 2);
    directional.position.set(5, 10, 7.5);
    scene.add(directional);

    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = false;

    
    const loader = new GLTFLoader();
    loader.load(
        './body.glb',
        (gltf) => {
            model = gltf.scene;

            
            model.scale.set(5,5,5);
            model.position.set(0,0,0);

            
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xaaaaaa,
                        roughness: 0.8,
                        metalness: 0
                    });
                }
            });

            scene.add(model);
            console.log("Body loaded ✅");
        },
        undefined,
        (error) => {
            console.error("Body load error ❌", error);
        }
    );

    // Click detection
    renderer.domElement.addEventListener('click', onClick);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onClick(event) {
    if (!model) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(model.children, true);

    if (intersects.length > 0) {
        const point = intersects[0].point;

        let part = "";
        if (point.y > 1) part = "head";
        else if (point.y > 0.3) part = "chest";
        else part = "legs";

        selectedParts.push(part);
        intersects[0].object.material.color.set(0xff0000); 
        console.log("Selected:", part);
    }
}