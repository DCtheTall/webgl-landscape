import { Scene } from './lib/Scene';
import { Plane } from './lib/Plane';

(function main() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const scene = new Scene(canvas);
  const plane = new Plane();
  scene.setPlanePoints(plane.getPlaneAsTriangleStrip());
  scene.render();
})();
