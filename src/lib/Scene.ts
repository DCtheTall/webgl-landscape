import getSceneRenderFrames, { RenderFrames } from './frames';

export default class Scene {
  private gl: WebGLRenderingContext;
  private renderFrames: RenderFrames;

  constructor(canvas: HTMLCanvasElement) {
    this.gl =
      canvas.getContext('webgl')
      || canvas.getContext('experimental-webgl');
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.renderFrames = getSceneRenderFrames(this.gl, canvas);
  }

  public render() {
    this.renderFrames.smoothShadedLandscape.render();
    this.renderFrames.celShadedLandscape.render();
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(
      this.gl.TEXTURE_2D, this.renderFrames.smoothShadedLandscape.texture);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(
      this.gl.TEXTURE_2D, this.renderFrames.celShadedLandscape.texture);
    this.renderFrames.textureFilter.render();
  }
}
