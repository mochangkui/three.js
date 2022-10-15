import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'

// 目标：了解three.js最基本的内容

// 1.创建场景
const scene = new THREE.Scene()

// 2.创建透视相机
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
// 2.1、设置相机位置
camera.position.set(0, 0, 10)
// 2.2、相机添加到场景中
scene.add(camera)

// 3.创建物体
// 3.1、创建几何体
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4, 200, 200, 200)
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

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

// 3.2、创建材质
// 导入纹理
const textureLoader = new THREE.TextureLoader(loadingManager)
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAoTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const doormetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const normalTexture = textureLoader.load('./textures/door/normal.jpg')
// 纹理偏移
// doorColorTexture.offset.x = 0.5
// doorColorTexture.offset.y = 0.5
// 设置旋转的原点
// doorColorTexture.center.set(0.5, 0.5)
// 纹理旋转
// doorColorTexture.rotation = Math.PI / 4
// 设置纹理的重复
// doorColorTexture.repeat.set(2, 3)
// 设置纹理的重复模式
doorColorTexture.wrapS = THREE.MirroredRepeatWrapping
doorColorTexture.wrapT = THREE.RepeatWrapping
const cubeMaterial = new THREE.MeshBasicMaterial({ 
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  opacity: 1,
  side: THREE.DoubleSide,
  aoMap: doorAoTexture,
  aoMapIntensity: 0.6
})

const material = new THREE.MeshStandardMaterial({ 
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  opacity: 1,
  side: THREE.DoubleSide,
  aoMap: doorAoTexture,
  aoMapIntensity: 0.6,
  displacementMap: doorHeightTexture,
  displacementScale: 0.2,
  roughness: 1,
  roughnessMap: doorRoughnessTexture,
  metalness: 1,
  metalnessMap: doormetalnessTexture,
  normalMap: normalTexture
})

// 3.3、根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, material)
// 3.4、将几何体添加到场景中
scene.add(cube)   
// 3.5 平面材质
const planeGeometry = new THREE.PlaneBufferGeometry(4, 4, 200, 200)
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
const plane = new THREE.Mesh(planeGeometry, material)
// 3.6 设置平面的位置
plane.position.set(4, 0, 0)
// 3.7、将几何体添加到场景中
scene.add(plane)
// 4.初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 4.1、设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 4.2、将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 5.创建轨迹控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 5.1、设置控制器阻尼，让控制器更具有真实效果，必须在动画循环里调用update()
controls.enableDamping = true

// 6.添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
// 6.1 添加到场景中
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
