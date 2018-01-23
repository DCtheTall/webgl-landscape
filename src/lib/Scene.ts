export class Scene {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private vertexBuffer: WebGLBuffer;
  private shaderProgram: WebGLProgram;
  private planePoints: Float32Array;
  private hasThrownError: boolean;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('No canvas in the HTML document');
    }
    this.canvas = canvas;
    this.gl = <WebGLRenderingContext>(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.viewport(0, 0, canvas.width, canvas.height);
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

  private sendVertexAttributes() {
    const planePositionAttrLoc = this.gl.getAttribLocation(this.shaderProgram, 'a_PlanePosition');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(planePositionAttrLoc, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(planePositionAttrLoc);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.planePoints, this.gl.DYNAMIC_DRAW);
  }

  public setPlanePoints(vals: Float32Array) {
    this.planePoints = vals;
  }

  public render() {
    if (this.hasThrownError) return;
    try {
      if (!this.planePoints) {
        throw new Error('You must set the plane points in the scene');
      }
      if (!this.shaderProgram) {
        this.createShaderProgram();
        this.sendVertexAttributes(); // TODO experiment if this needs to be sent every frame
      }
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, (this.planePoints.length / 2));
    } catch (err) {
      console.error(err);
      this.hasThrownError = true;
    }
  }
}
