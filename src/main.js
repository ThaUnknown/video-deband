import { VideoTexture, OrthographicCamera, Scene, Vector2, Mesh, PlaneGeometry, ShaderMaterial, WebGLRenderer } from 'three'
import 'rvfc-polyfill'
import { fragmentShader, vertexShader } from './shaders.js'

export default class VideoDeband {
  /** @type {HTMLCanvasElement} */
  canvas
  destroyed = false
  /**
   * @param {HTMLVideoElement} video
   */
  constructor (video) {
    if (!video) throw new Error('Video element required')

    const texture = new VideoTexture(video)
    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 1000)
    camera.position.z = 1

    const uniforms = {
      texture_size: { type: 'v2', value: new Vector2(video.videoWidth, video.videoWidth) },
      u_texture: { type: 't', value: texture },
      random: { type: 'f', value: Math.random() }
    }

    const planeMesh = new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    )

    scene.add(planeMesh)

    this.renderer = new WebGLRenderer()
    this.canvas = this.renderer.domElement
    this.renderer.setSize(video.videoWidth, video.videoHeight)

    const resizeVideo = () => {
      this.renderer.setSize(video.videoWidth, video.videoHeight)
      this.canvas.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`

      planeMesh.material.uniforms.texture_size.value.set(video.videoWidth, video.videoHeight)
    }

    const animateScene = () => {
      if (this.destroyed) return
      planeMesh.material.uniforms.random.value = Math.random()

      this.renderer.render(scene, camera)

      video.requestVideoFrameCallback(animateScene)
    }

    video.requestVideoFrameCallback(animateScene)

    video.addEventListener('resize', resizeVideo) // when video has variable resolution
    video.addEventListener('loadedmetadata', resizeVideo) // when video resolution metadata loads
  }

  getStream () {
    return this.canvas.captureStream()
  }

  getVideo () {
    const video = document.createElement('video')
    video.srcObject = this.getStream()
    video.play()
    return video
  }

  [Symbol.dispose] () {
    this.destroy()
  }

  dispose () {
    this.destroy()
  }

  destroy () {
    this.destroyed = true
    this.renderer.dispose()
  }
}
