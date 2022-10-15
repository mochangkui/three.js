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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 3.2、创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// 3.3、根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 3.4、修改物体的位置
// cube.position.set(5, 0, 0)
// 3.5、缩放
cube.scale.set(3, 2, 1)
// 3.6、旋转
cube.rotation.set(Math.PI / 4, 0, 0)
// 3.7、将几何体添加到场景中
scene.add(cube)

// 4.初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 4.1、设置渲染的尺寸大小
renderer.setSize(500, 500)
// 4.2、将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 5.使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)

// 5.创建轨迹控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 5.1、设置控制器阻尼，让控制器更具有真实效果，必须在动画循环里调用update()
controls.enableDamping = true

// 6.添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
// 6.1 添加到场景中
scene.add(axesHelper)

// gsap.to(cube.position, { x: 5, duration: 5})
// gsap.to(cube.rotation, { y: 2 * Math.PI, duration: 5 })

const gui = new dat.GUI()
// 修改物体x轴
gui.add(cube.position, "x")
  .min(0)
  .max(5)
  .step(0.01)
  .name("移动x轴")
  .onChange((value) => {
    console.log("值被修改：", value)
  })
  .onFinishChange((value) => {
    console.log("完全停下来：", value)
  })

// 修改物体的颜色
const params = {
  color: "#ffff00",
  fn: () => {
    gsap.to(cube.position, { x: 5, duration: 5, yoyo: true, repeat: -1 })
  }
}

// 修改物体显示隐藏
gui.add(cube, "visible").name("是否显示")


// 把配置放在分类放文件夹中
const folder = gui.addFolder("设置立方体")
folder.addColor(params, "color").onChange((value) => {
  cube.material.color.set(value)
})
// 修改物体材质为线条
folder.add(cube.material, "wireframe")
// 设置按钮点击触发某个事件
folder.add(params, "fn").name("立方体运动")

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
