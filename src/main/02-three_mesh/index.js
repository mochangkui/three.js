import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：制作酷炫科技感三角形

// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
// 2.1、设置相机位置
camera.position.set(0, 0, 10)
// 2.2、相机添加到场景中
scene.add(camera)

// 3.创建物体
// 3.1、创建几何体
const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2)
// 3.2、创建材质
// 导入纹理
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  map: doorColorTexture
})
// 3.3、根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
// 3.4、将几何体添加到场景中
scene.add(cube)

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
