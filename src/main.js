import { createProgramInfo, createBufferInfoFromArrays, setBuffersAndAttributes, setUniforms, drawBufferInfo } from 'twgl.js'
import 'rvfc-polyfill'
import { fragmentShader, vertexShader } from './shaders.js'

export default class VideoDeband {
  canvas = document.createElement('canvas')
  gl
  texture

  destroyed = false

  /**
   * @param {HTMLVideoElement} video
   * @param {WebGLContextAttributes} [options]
   **/
  constructor (video, options = { alpha: false, powerPreference: 'high-performance', desynchronized: true }) {
    if (!video) throw new Error('Video element required')
    this.gl = /** @type {WebGL2RenderingContext} */(this.canvas.getContext('webgl2', options))
    if (!this.gl) throw new Error('WebGL2 not supported')
    this.texture = this.gl.createTexture()

    const programInfo = createProgramInfo(this.gl, [vertexShader, fragmentShader])
    this.gl.useProgram(programInfo.program)

    const bufferInfo = createBufferInfoFromArrays(this.gl, {
      position: {
        numComponents: 3,
        data: [
          -1, -1, 0,
          1, -1, 0,
          -1, 1, 0,
          1, 1, 0
        ]
      },
      uv: {
        numComponents: 2,
        data: [
          0, 1,
          1, 1,
          0, 0,
          1, 0
        ]
      },
      indices: {
        numComponents: 1,
        data: [
          0, 1, 2,
          2, 1, 3
        ]
      }
    })
    setBuffersAndAttributes(this.gl, programInfo, bufferInfo)

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)

    const resizeVideo = (/** @type {number} */ width, /** @type {number} */ height) => {
      this.canvas.width = width
      this.canvas.height = height

      this.canvas.style.aspectRatio = `${width} / ${height}`

      this.gl.viewport(0, 0, width, height)
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)

      setUniforms(programInfo, { texture_size: [width, height] })
    }

    /**
     * @param {number} _
     * @param {{height: number, width: number}} metadata
     */
    const animateScene = (_, { height, width }) => {
      if (this.destroyed) return
      if (height !== this.canvas.height || width !== this.canvas.width) resizeVideo(width, height)
      this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, 0, 0, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, video)

      setUniforms(programInfo, { random: Math.random() })

      drawBufferInfo(this.gl, bufferInfo, this.gl.TRIANGLE_STRIP)

      video.requestVideoFrameCallback(animateScene)
    }

    video.requestVideoFrameCallback(animateScene)
  }

  getStream () {
    return this.canvas.captureStream()
  }

  async getVideo () {
    const video = document.createElement('video')
    video.muted = true
    video.srcObject = this.getStream()
    await video.play()
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
    this.canvas.remove()
    this.gl.deleteTexture(this.texture)
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
