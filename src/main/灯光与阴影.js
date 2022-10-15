import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 创建场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)
// 相机添加到场景中
scene.add(camera)

const sphereGeometry = new THREE.SphereBufferGeometry(1, 10, 10)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.4,
  side: THREE.DoubleSide,
})

// 根据几何体和材质创建物体
const sphere = new THREE.Mesh(sphereGeometry, material)
// 投射阴影
sphere.castShadow = true
// 将几何体添加到场景中
scene.add(sphere)

// 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
// 根据几何体和材质创建物体
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
// 接收阴影
plane.receiveShadow = true
// 将几何体添加到场景中
scene.add(plane)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true
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
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// directionalLight.position.set(10, 10, 10)
// directionalLight.castShadow = true
// // 设置阴影贴图模糊度
// directionalLight.shadow.radius = 20
// // 设置阴影贴图的分辨率
// directionalLight.shadow.mapSize.set(2048, 2048)
// scene.add(directionalLight)

// 聚光灯
// const spotLight = new THREE.SpotLight(0xffffff, 1)
// spotLight.position.set(10, 10, 10)
// spotLight.castShadow = true
// // 设置阴影贴图模糊度
// spotLight.shadow.radius = 20
// // 设置阴影贴图的分辨率
// spotLight.shadow.mapSize.set(2048, 2048)
// scene.add(spotLight)

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(10, 10, 10)
pointLight.castShadow = true
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(2048, 2048)
scene.add(pointLight)

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
