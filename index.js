import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@1.29.1'

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

document.body.style.margin = '0px'

const getWidth = () => window.innerWidth
const getHeight = () => window.innerHeight

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(getWidth(), getHeight())
renderer.setAnimationLoop(() => renderer.render(scene, camera))
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, getWidth() / getHeight(), 1, 1000)
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

const getSearch = (name, def = '') => {
  const url = new URL(window.location)
  const param = url.searchParams.get(name)
  return param || def
}

const GEMINI_API_KEY = getSearch('GEMINI', '')

const VOICE_API_KEY = getSearch('VOICE', '')

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const getVoiceURL = (text) => `https://api.voicerss.org/?key=${VOICE_API_KEY}&hl=en-us&src=` + encodeURIComponent(text)

//

const model = 'gemini-2.5-pro'

const onInputValue = async () => {
  const contents = input.value
  input.value = ''
  const response = await ai.models.generateContent({ model, contents })

  const text = response.text
  console.log({ text })

  const audio = document.createElement('audio')
  audio.autoplay = true
  audio.src = getVoiceURL(text)
  document.body.append(audio)
}

const input = document.getElementById('input')

input.addEventListener('keyup', (ev) => (ev.key == 'Enter') && onInputValue())
