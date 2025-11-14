import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

document.body.style.margin = '0px'

const getWidth = () => 450
const getHeight = () => getWidth() * 4 / 3

const videos = document.getElementById('videos')
videos.style.display = 'flex'
videos.style.justifyContent = 'space-between'

const robot = document.getElementById('robot')
robot.style.backgroundColor = '#000000'

const human = document.getElementById('human')
const video = document.createElement('video')
video.style.height = getHeight() + 'px'
video.style.width = getWidth() + 'px'
video.autoplay = true
video.muted = true
video.style.backgroundColor = '#000000'
human.appendChild(video)

const start = document.getElementById('start')

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(getHeight(), getWidth())
const onAnimationLoop = () => renderer.setAnimationLoop(() => renderer.render(scene, camera))
robot.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, getHeight() / getWidth(), 1, 1000)
camera.position.z = 120

scene.add(new THREE.AmbientLight(0x666666))

const dirLight = new THREE.DirectionalLight(0xffddcc, 3)
dirLight.position.set(1, 0.75, 0.5)
scene.add(dirLight)

const textureLoader = new THREE.TextureLoader()

const map = textureLoader.load('models/gltf/LeePerrySmith/Map-COL.jpg')
map.colorSpace = THREE.SRGBColorSpace
const specularMap = textureLoader.load('models/gltf/LeePerrySmith/Map-SPEC.jpg')
const normalMap = textureLoader.load('models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg')

const gltfLoader = new GLTFLoader()

gltfLoader.load('models/gltf/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
  const mesh = gltf.scene.children[0]

  mesh.material = new THREE.MeshPhongMaterial({
    specular: 0x111111,
    map: map,
    specularMap: specularMap,
    normalMap: normalMap,
    shininess: 25
  })

  scene.add(mesh)

  mesh.scale.multiplyScalar(10)
})

//

start.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  video.srcObject = stream
  onAnimationLoop()
})
