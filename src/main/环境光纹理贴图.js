import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 加载hdr环境图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 创建场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)
// 相机添加到场景中
scene.add(camera)

// 设置加载管理器
function onLoad (e) {
  console.log('图片加载完成')
}
function onProgress  (e, num, total) {
  console.log(e, num, total)
  console.log('图片加载进度')
  console.log('加载进度百分比：', ((num / total) * 100).toFixed(2))

}
function onError (e) {
  console.log(e)
  console.log('图片加载出现错误')
}
const loadingManager = new THREE.LoadingManager(onLoad, onProgress, onError)

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/1/px.jpg",
  "textures/environmentMaps/1/nx.jpg",
  "textures/environmentMaps/1/py.jpg",
  "textures/environmentMaps/1/ny.jpg",
  "textures/environmentMaps/1/pz.jpg",
  "textures/environmentMaps/1/nz.jpg",
])

// 加载hdr环境图
const rgbeLoader = new RGBELoader(loadingManager)
rgbeLoader.loadAsync("textures/hdr/002.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  // 给场景添加背景
  scene.background =  texture
  // 给场景所有的物体添加默认的环境贴图
  scene.environment = texture
})

const sphereGeometry = new THREE.SphereBufferGeometry(3, 20, 20)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  // envMap: envMapTexture
})

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(sphereGeometry, material)
// 将几何体添加到场景中
scene.add(cube)  
// 给场景添加背景
// scene.background =  envMapTexture
// 给场景所有的物体添加默认的环境贴图
// scene.environment = envMapTexture

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 创建轨迹控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼，让控制器更具有真实效果，必须在动画循环里调用update()
controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
// 添加到场景中
scene.add(axesHelper)

// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

function render (time) {
  controls.update()
  renderer.render(scene, camera)
  // 渲染下一帧的时候就会调用rende函数
  requestAnimationFrame(render)
}

render()

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新相机
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})

// 控制画布全屏和退出全屏
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
