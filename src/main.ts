import { Scene } from './lib/Scene';
import { Plane } from './lib/Plane';

(function main() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const scene = new Scene(canvas);
  const plane = new Plane();
  scene.setPlanePoints(plane.getPlaneAsTriangleStrip());
  scene.render();
})();
