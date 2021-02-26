import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import { VRButton } from '/jsm/webxr/VRButton'
import { XRControllerModelFactory } from '/jsm/webxr/XRControllerModelFactory'
import {GLTF, GLTFLoader} from '/jsm/loaders/GLTFLoader'


const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.y = -5;
camera.position.z = 10;

const cameraFixture = new THREE.Group();
cameraFixture.add(camera);
cameraFixture.position.set(0,0,5);
scene.add(cameraFixture);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

document.body.appendChild(VRButton.createButton(renderer))
//XR renderer enabled
renderer.xr.enabled = true;

let darkFog: THREE.Fog = new THREE.Fog(0x000000, 1, 100);
scene.fog = darkFog;


const controls = new OrbitControls(camera, renderer.domElement)


let vrController: any;
let vrController2: any;
let cylinderMaterial:THREE.MeshPhongMaterial;


function createVRController(controllerId:number){
    const cylinderGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1, 8);
    cylinderMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    const cylinder: THREE.Mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = -1;
    cylinder.position.z = 1;
    cylinder.geometry.translate(0,0.5,0);
    cylinder.rotateX(-0.25 * Math.PI);

    vrController = renderer.xr.getController( controllerId );
    vrController.add(cylinder);
    cameraFixture.add(vrController);

    vrController.addEventListener('selectstart', () => { cylinderMaterial.color.set(0x00ff00)});
    vrController.addEventListener('selectend', () => {cylinderMaterial.color.set(0xff0000)});
}

createVRController(0);
createVRController(1);

//## using 3D models as VR Controllers and Loading them with the GLTF Loader
/*function createVRController(controllerId:number){
    const loader:GLTFLoader = new GLTFLoader();
loader.load(
    'assets/deagle/scene.gltf', function(gltf) {
        gltf.scene.scale.set(0.3,0.3,0.3);
        gltf.scene.translateY(-2);
        gltf.scene.translateX(1);
        
        //scene.add(gltf.scene);
        vrController = renderer.xr.getController(controllerId);
        scene.add(gltf.scene);
        vrController.add(gltf.scene);
        cameraFixture.add(vrController);
        console.log("controller 1 working");
        
    } 
)};

function createSecondVRController(controllerId:number){
    const secondLoader:GLTFLoader = new GLTFLoader();
    secondLoader.load(
        'assets/flashlight/scene.gltf',function(gltf){
            gltf.scene.scale.set(0.1,0.1,0.1);
            gltf.scene.rotateY(Math.PI/2);
            gltf.scene.translateY(-0.5);
            
            vrController2 = renderer.xr.getController(controllerId);
            scene.add(gltf.scene);
            vrController2.add(gltf.scene);
            cameraFixture.add(vrController2);
            console.log("controller 2 working");
        }
    )
}*/
//createVRController(0);
//createSecondVRController(1);


const geometry: THREE.BoxGeometry = new THREE.BoxGeometry()
const planeGeo: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(250,250,100,100)
const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x320088, wireframe: false, })
const planeMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({color:0x320011})
planeMaterial.wireframe = false;

const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
scene.add(cube)
cube.scale.set(2,2,2)

const terrain: THREE.Mesh = new THREE.Mesh(planeGeo, planeMaterial);
terrain.rotation.x = -Math.PI / 2;
terrain.position.y = -6;
scene.add(terrain);

let peak = 10;
let vertices = terrain.geometry.attributes.position.array;
for(let i = 0; i <= vertices.length; i += 69){
    vertices[i+2] = peak * Math.random();
}
terrain.geometry.attributes.position.needsUpdate = true;
terrain.geometry.computeVertexNormals();

const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight)

const pointLight: THREE.PointLight = new THREE.PointLight(0xffffff, 12 ,32);
pointLight.position.y = 20;
scene.add(pointLight)
const sphereHelperSize = 1;
const pointLightHelper: THREE.PointLightHelper = new THREE.PointLightHelper(pointLight, sphereHelperSize);
scene.add(pointLightHelper);

/*const cylinderGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1, 8);
const cylinderMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000, wireframe: true} );
const cylinder: THREE.Mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.y = -1;
//Render Controller
const vrController1 = renderer.xr.getController(0);
vrController1.add(cylinder);
cameraFixture.add(vrController1);

cylinder.geometry.translate(0,0.5,0);
cylinder.rotateX(-0.25 * Math.PI);*/


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    //render()
}

/*var animate = function () {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update()

    render()*/
//};

/*function render() {
    renderer.render(scene, camera)
}
animate();*/

renderer.setAnimationLoop( function () {

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );

    peak += Math.sin(2);
    
   

} );

console.log("Just a demo but its working!");


