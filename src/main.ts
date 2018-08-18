
import Scene from './lib/Scene';

(function main() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const scene = new Scene(canvas);
  scene.render(true);
})();
