import { Camera } from './Camera';
import { Plane } from './Plane';

const FRAME_RATE = 30; // fps

export class Scene {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private vertexBuffer: WebGLBuffer;
  private gradientBuffer: WebGLBuffer;
  private camera: Camera;
  private shaderProgram: WebGLProgram;
  private planeVertices: Float32Array;
  private planeGradients: Float32Array;
  private hasThrownError: boolean;
  private rendering: boolean;
  private firstRender: number;
  private lastRender: number;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('No canvas in the HTML document');
    }
    this.canvas = canvas;
    this.gl = <WebGLRenderingContext>(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    this.vertexBuffer = this.gl.createBuffer();
    this.gradientBuffer = this.gl.createBuffer();
    this.gl.clearColor(.75, .87, .9, 1);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera = new Camera();
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Shader failed to compile: ${this.gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  }

  private createShaderProgram() {
    const vertexShaderSource = <string>require('../shaders/vertex.glsl');
    const fragmentShaderSource = <string>require('../shaders/fragment.glsl');
    const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Could not initialize shader program.');
    }
    this.gl.useProgram(shaderProgram);
    this.shaderProgram = shaderProgram;
  }

  private sendVectorAttributes(symbol: string, buffer: WebGLBuffer, vals: Float32Array) {
    const attrLoc = this.gl.getAttribLocation(this.shaderProgram, symbol);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(attrLoc, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attrLoc);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vals, this.gl.DYNAMIC_DRAW);
  }

  private sendMatrixUniform(name: string, matrix: Float32Array) {
    const location = this.gl.getUniformLocation(this.shaderProgram, name);
    this.gl.uniformMatrix4fv(location, false, matrix);
  }

  private sendUniforms(time: number = 0) {
    this.sendMatrixUniform('u_ViewMatrix', this.camera.getLookAt());
    this.sendMatrixUniform('u_PerspectiveMatrix', this.camera.getPerspective(this.canvas));

    const cameraPositionLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_CameraPosition');
    this.gl.uniform3fv(cameraPositionLocation, this.camera.getPosition());

    const timeLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_Time');
    this.gl.uniform1f(timeLocation, time && -(time - this.firstRender) / 100);
  }

  public setPlane(plane: Plane) {
    this.planeVertices = plane.getVerticesAsTriangleStrip();
  }

  public render(animate?: boolean) {
    const now = Date.now();
    if (!this.lastRender) this.firstRender = now;
    if (
      this.rendering
      || this.hasThrownError
      || (this.lastRender && now - this.lastRender < 1000 / FRAME_RATE)
    ) {
      if (animate) window.requestAnimationFrame(() => this.render(true));
      return;
    }
    try {
      if (!this.planeVertices) {
        throw new Error('You must set the plane points in the scene');
      }
      this.rendering = true;
      if (!this.shaderProgram) {
        this.createShaderProgram();
        this.sendVectorAttributes('a_PlaneVertex', this.vertexBuffer, this.planeVertices); // TODO experiment if this needs to be sent every frame
      }
      this.sendUniforms(animate ? now : 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, (this.planeVertices.length / 2));
      this.rendering = false;
      this.lastRender = now;
      if (animate) window.requestAnimationFrame(() => this.render(true));
    } catch (err) {
      console.error(err);
    }
  }
}
