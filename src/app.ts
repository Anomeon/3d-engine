import { Drawer } from './Drawer';
import { Point } from './engine/Point';
import { Vector } from './engine/Vector';
import { Camera } from './engine/Camera';
import { Line } from './engine/Line';
import { Triangle } from './engine/Triangle';
import { Polygon } from './engine/Polygon';
import { MathExt } from './engine/MathExt';
import fs from 'fs';

// @ts-ignore
window.render = true;

let SHIFT_FROM_Z;

const readObjFile = () => {
  // const sourceCode = fs.readFileSync(__dirname + '/models/boxes.obj', 'utf8');
  // SHIFT_FROM_Z = 12;
  // const sourceCode = fs.readFileSync(__dirname + '/models/cube.obj', 'utf8');
  // SHIFT_FROM_Z = 3;
  const sourceCode = fs.readFileSync(__dirname + '/models/spaceship.obj', 'utf8');
  SHIFT_FROM_Z = 8;
  const splitted: string[] = sourceCode.split('\n');
  const points: RegExpMatchArray[][] = [];
  const indexes: RegExpMatchArray[][] = [];

  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i][0] === 'v') {
      points.push([...splitted[i].matchAll(/-?[0-9]+\.?[0-9]*/g)]);
    }
    if (splitted[i][0] === 'f') {
      indexes.push([...splitted[i].matchAll(/[0-9]+/g)]);
    }
  }

  return { points, indexes };
}

const canvas = document.querySelector('canvas');

const ctx = canvas?.getContext('2d');

let cameraState = {x: 0, y: 0, z: 0, xy: 0, xz: 0, yz: 0, shift: false, hasCameraEnabled: true };

document.body.addEventListener('keydown', (e) => {
  if (e.code === 'ShiftLeft') {

    cameraState.shift = true;
  }
});

const mouseMoveHandler = (e) => {
  if (cameraState.x < e.clientX) {
    cameraState.xy += 1 % 360;
  } else if (cameraState.x > e.clientX) {
    cameraState.xy -= 1 % 360;
  }

  if (cameraState.shift) {
    if (cameraState.z < e.clientY) {
      cameraState.xz += 1 % 360;
    } else if (cameraState.z > e.clientY) {
      cameraState.xz -= 1 % 360;
    }
    cameraState.z = e.clientY;
  } else {
    if (cameraState.y < e.clientY) {
      cameraState.yz += 1 % 360;
    } else if (cameraState.y > e.clientY) {
      cameraState.yz -= 1 % 360;
    }
    cameraState.y = e.clientY;
  }

  cameraState.x = e.clientX;
};

document.body.addEventListener('mousemove', mouseMoveHandler);

document.querySelector('#run-render')?.addEventListener('click', () => {
  window.render = true;
});
document.querySelector('#stop-render')?.addEventListener('click', () => {
  window.render = false;
});

if (canvas && ctx) {
  ctx.fillStyle = '#fff';

  new Drawer(ctx);
  const camera = new Camera(0, canvas?.width, 0, canvas?.height);
  const { points, indexes } = readObjFile();

  const cameraRender = (timestamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let vectors: Array<[Vector, Vector, Vector, number]> = [];
    let dotProductForLight;
    // Draw triangles
    for (let i = 0; i < indexes.length; i++) {

      let v1 = new Vector(+points[+indexes[i][0] - 1][0], +points[+indexes[i][0] - 1][1], +points[+indexes[i][0] - 1][2]);
      let v2 = new Vector(+points[+indexes[i][1] - 1][0], +points[+indexes[i][1] - 1][1], +points[+indexes[i][1] - 1][2]);
      let v3 = new Vector(+points[+indexes[i][2] - 1][0], +points[+indexes[i][2] - 1][1], +points[+indexes[i][2] - 1][2]);

      // Rotate on tick
      v1 = v1.rotateYZ(MathExt.round(timestamp / 15 % 360));
      v2 = v2.rotateYZ(MathExt.round(timestamp / 15 % 360));
      v3 = v3.rotateYZ(MathExt.round(timestamp / 15 % 360));

      v1 = v1.rotateXY(MathExt.round(timestamp / 15 % 360));
      v2 = v2.rotateXY(MathExt.round(timestamp / 15 % 360));
      v3 = v3.rotateXY(MathExt.round(timestamp / 15 % 360));

      v1 = v1.rotateXZ(MathExt.round(timestamp / 15 % 360));
      v2 = v2.rotateXZ(MathExt.round(timestamp / 15 % 360));
      v3 = v3.rotateXZ(MathExt.round(timestamp / 15 % 360));

      // Fixed rotation
      // v1 = v1.rotateXZ(MathExt.round(35));
      // v2 = v2.rotateXZ(MathExt.round(35));
      // v3 = v3.rotateXZ(MathExt.round(35));

      // Manual rotation by mouse
      // v1 = v1.rotateXY(MathExt.round(cameraState.xy));
      // v2 = v2.rotateXY(MathExt.round(cameraState.xy));
      // v3 = v3.rotateXY(MathExt.round(cameraState.xy));

      // v1 = v1.rotateYZ(MathExt.round(cameraState.yz));
      // v2 = v2.rotateYZ(MathExt.round(cameraState.yz));
      // v3 = v3.rotateYZ(MathExt.round(cameraState.yz));

      // v1 = v1.rotateXZ(MathExt.round(cameraState.xz));
      // v2 = v2.rotateXZ(MathExt.round(cameraState.xz));
      // v3 = v3.rotateXZ(MathExt.round(cameraState.xz));

      // A bit change object points, to have centered by x, y perspective
      // And be outside object by z

      v1.z = v1.z + SHIFT_FROM_Z;
      v2.z = v2.z + SHIFT_FROM_Z;
      v3.z = v3.z + SHIFT_FROM_Z;

      const diffV2V1 = v2.subtractVectorFromVector(v1);
      const diffV3V1 = v3.subtractVectorFromVector(v1);
      const normal = diffV2V1.crossProduct(diffV3V1);

      const unitNormal = normal.unitVector();

      // Exclude from render internal side
      if (unitNormal.dotProduct(v1.subtractVectorFromVector(new Vector(camera.minX, camera.minY, camera.minZ))) < 0) {

        const lightDirectionNormal = new Vector(0, 0, -1).unitVector();
        dotProductForLight = unitNormal.dotProduct(lightDirectionNormal);

        const projectedV1 = MathExt.multiplyVectorToMatrix(v1, camera.projectionMatrix);
        const projectedV2 = MathExt.multiplyVectorToMatrix(v2, camera.projectionMatrix);
        const projectedV3 = MathExt.multiplyVectorToMatrix(v3, camera.projectionMatrix);

        vectors.push([projectedV1, projectedV2, projectedV3, dotProductForLight]);
      }
    }
    vectors.sort((a, b) => { return (b[0].z + b[1].z + b[2].z) / 3 - (a[0].z + a[1].z + a[2].z) / 3})

    for (let i = 0; i < vectors.length; i++) {
      const kx = canvas.width * 0.5;
      const ky = canvas.height * 0.5;
      const x = 1;
      const y = 1;

      // const lineColor = coords[3];
      // const fillColor = i < 16 ? coords[3] : undefined;

      // const lineColor = `#fff`;
      // const fillColor = `#fff`;

      const lineColor = `hsl(0, 0%, ${vectors[i][3] * 100}%)`;
      const fillColor = `hsl(0, 0%, ${vectors[i][3] * 100}%)`;
      const triangle = new Triangle((vectors[i][0].x + x) * kx, (vectors[i][0].y + y) * ky, (vectors[i][1].x + x) * kx, (vectors[i][1].y + y) * ky, (vectors[i][2].x + x) * kx, (vectors[i][2].y + y) * ky, lineColor, fillColor);

      camera.drawScene(triangle.getPoints());
    }
    if (window.render) {
      requestAnimationFrame(cameraRender);
    }
  }

  if (window.render) {
    requestAnimationFrame(cameraRender);
  }

  document.body.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft') {
      cameraState.shift = false;
    }
    if (e.code === 'Space') {
      cameraState.hasCameraEnabled = !cameraState.hasCameraEnabled;
      if (cameraState.hasCameraEnabled) {
        document.body.removeEventListener('mousemove', mouseMoveHandler);
        window.render = false;
      } else {
        document.body.addEventListener('mousemove', mouseMoveHandler);
        window.render = true;
        requestAnimationFrame(cameraRender);
      }
    }
  });
}
