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
  const sourceCode = fs.readFileSync(__dirname + '/models/cube.obj', 'utf8');
  SHIFT_FROM_Z = 3;
  // const sourceCode = fs.readFileSync(__dirname + '/models/spaceship.obj', 'utf8');
  // SHIFT_FROM_Z = 8;
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
let player = { yaw: 0 };

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

let vLookDir;

const intersectPlane = (planeP: Vector, planeN: Vector, lineStart: Vector, lineEnd: Vector) => {
  const planeNnormalized = planeN.unitVector();
  const planeD = -planeNnormalized.dotProduct(planeP);
  const ad = lineStart.dotProduct(planeNnormalized);
  const bd = lineEnd.dotProduct(planeNnormalized);
  const t = (-planeD - ad) / (bd - ad);
  const lineStartToEnd = lineEnd.subtractVectorFromVector(lineStart);
  const lineToIntersect = lineStartToEnd.multiplyVectorToScalar(t);
  return lineStart.addVectorToVector(lineToIntersect);
};

const getDist = (planeNnormalized: Vector, p: Vector, planeP: Vector) => {
  return planeNnormalized.dotProduct(p) - planeNnormalized.dotProduct(planeP);
}

const getAdditionalVectorsIfRequiredBecauseOfClipping = (planeP: Vector, planeN: Vector, v1: Vector, v2: Vector, v3: Vector) => {
  let nInsidePointCount = 0;
  let nOutsidePointCount = 0;
  const insidePoints = [];
  const outsidePoints = [];

  const planeNnormalized = planeN.unitVector();

  const d1 = getDist(planeNnormalized, v1, planeP)
  const d2 = getDist(planeNnormalized, v2, planeP)
  const d3 = getDist(planeNnormalized, v3, planeP)

  if (d1 >= 0) {
    nInsidePointCount++;
    insidePoints.push(v1);
  } else {
    nOutsidePointCount++;
    outsidePoints.push(v1);
  }

  if (d2 >= 0) {
    nInsidePointCount++;
    insidePoints.push(v2);
  } else {
    nOutsidePointCount++;
    outsidePoints.push(v2);
  }

  if (d3 >= 0) {
    nInsidePointCount++;
    insidePoints.push(v3);
  } else {
    nOutsidePointCount++;
    outsidePoints.push(v3);
  }

  console.log(nInsidePointCount);

  if (nInsidePointCount === 0) {
    return [];
  }

  if (nInsidePointCount === 3) {
    return [v1, v2, v3];
  }

  if (nInsidePointCount === 1 && nOutsidePointCount === 2) {
    return [
      insidePoints[0],
      intersectPlane(planeP, planeN, insidePoints[0], outsidePoints[0]),
      intersectPlane(planeP, planeN, insidePoints[0], outsidePoints[1]),
    ];
  }

  if (nInsidePointCount === 2 && nOutsidePointCount === 1) {
    const newV = intersectPlane(planeP, planeN, insidePoints[0], outsidePoints[0]);
    return [
      insidePoints[0],
      insidePoints[1],
      newV,

      insidePoints[1],
      newV,
      intersectPlane(planeP, planeN, insidePoints[1], outsidePoints[0]),
    ];
  }

  return [];

}

if (canvas && ctx) {
  ctx.fillStyle = '#fff';

  new Drawer(ctx);
  const camera = new Camera(0, canvas?.width, 0, canvas?.height);
  let vCamera = new Vector(camera.minX, camera.minY, camera.minZ);

  const { points, indexes } = readObjFile();

  const cameraRender = (timestamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let vectors: Array<[Vector, Vector, Vector, number]> = [];
    let dotProductForLight;

    // let vLookDir = new Vector(0, 0, 1)
    let vUp = new Vector(0, 1, 0);
    // let vTarget = vCamera.addVectorToVector(vLookDir);
    let vTarget = new Vector(0, 0, 1);

    vLookDir = vTarget.rotateXZ(player.yaw);
    vTarget = vCamera.addVectorToVector(vLookDir);
    let newForward = vTarget.subtractVectorFromVector(vCamera).unitVector();

    let a = newForward.multiplyVectorToScalar(vUp.dotProduct(newForward));
    let newUp = vUp.subtractVectorFromVector(a).unitVector();

    let newRight = newUp.crossProduct(newForward);

    const matCamera = [
      [newRight.x,   newRight.y,   newRight.z,   0],
      [newUp.x,      newUp.y,      newUp.z,      0],
      [newForward.x, newForward.y, newForward.z, 0],
      [vCamera.x,    vCamera.y,    vCamera.z,    1],
    ];

    const matView = [
      [newRight.x, newUp.x, newForward.x, 0],
      [newRight.y, newUp.y, newForward.y, 0],
      [newRight.z, newUp.z, newForward.z, 0],
      [
        -(vCamera.x * newRight.x   + vCamera.y * newRight.y   + vCamera.z * newRight.z),
        -(vCamera.x * newUp.x      + vCamera.y * newUp.y      + vCamera.z * newUp.z),
        -(vCamera.x * newForward.x + vCamera.y * newForward.y + vCamera.z * newForward.z),
        1,
      ],
    ];

    // Draw triangles
    for (let i = 0; i < indexes.length; i++) {

      let v1 = new Vector(+points[+indexes[i][0] - 1][0], +points[+indexes[i][0] - 1][1], +points[+indexes[i][0] - 1][2]);
      let v2 = new Vector(+points[+indexes[i][1] - 1][0], +points[+indexes[i][1] - 1][1], +points[+indexes[i][1] - 1][2]);
      let v3 = new Vector(+points[+indexes[i][2] - 1][0], +points[+indexes[i][2] - 1][1], +points[+indexes[i][2] - 1][2]);

      // Rotate on tick
      // v1 = v1.rotateYZ(MathExt.round(timestamp / 15 % 360));
      // v2 = v2.rotateYZ(MathExt.round(timestamp / 15 % 360));
      // v3 = v3.rotateYZ(MathExt.round(timestamp / 15 % 360));

      // v1 = v1.rotateXY(MathExt.round(timestamp / 15 % 360));
      // v2 = v2.rotateXY(MathExt.round(timestamp / 15 % 360));
      // v3 = v3.rotateXY(MathExt.round(timestamp / 15 % 360));

      // v1 = v1.rotateXZ(MathExt.round(timestamp / 15 % 360));
      // v2 = v2.rotateXZ(MathExt.round(timestamp / 15 % 360));
      // v3 = v3.rotateXZ(MathExt.round(timestamp / 15 % 360));

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
      if (unitNormal.dotProduct(v1.subtractVectorFromVector(vCamera)) < 0) {

        const lightDirectionNormal = new Vector(0, 0, -1).unitVector();
        dotProductForLight = Math.max(0.3, unitNormal.dotProduct(lightDirectionNormal));

        const viewedV1 = MathExt.multiplyVectorToMatrix(v1, matView);
        const viewedV2 = MathExt.multiplyVectorToMatrix(v2, matView);
        const viewedV3 = MathExt.multiplyVectorToMatrix(v3, matView);

        const newVectors = getAdditionalVectorsIfRequiredBecauseOfClipping(new Vector(0, 0, 0.1), new Vector(0, 0, 1), viewedV1, viewedV2, viewedV3);

        for (let j = 0; j < newVectors.length; j+=3) {
          let projectedV1 = MathExt.multiplyVectorToMatrix(newVectors[j], camera.projectionMatrix);
          let projectedV2 = MathExt.multiplyVectorToMatrix(newVectors[j+1], camera.projectionMatrix);
          let projectedV3 = MathExt.multiplyVectorToMatrix(newVectors[j+2], camera.projectionMatrix);

          projectedV1 = projectedV1.divideVectorToScalar(projectedV1.w);
          projectedV2 = projectedV2.divideVectorToScalar(projectedV2.w);
          projectedV3 = projectedV3.divideVectorToScalar(projectedV3.w);

          projectedV1.x *= -1;
          projectedV1.y *= -1;
          projectedV2.x *= -1;
          projectedV2.y *= -1;
          projectedV3.x *= -1;
          projectedV3.y *= -1;

          const kx = canvas.width * 0.5;
          const ky = canvas.height * 0.5;
          const x = 1;
          const y = 1;

          projectedV1.x = (projectedV1.x + x) * kx;
          projectedV1.y = (projectedV1.y + y) * ky;
          projectedV2.x = (projectedV2.x + x) * kx;
          projectedV2.y = (projectedV2.y + y) * ky;
          projectedV3.x = (projectedV3.x + x) * kx;
          projectedV3.y = (projectedV3.y + y) * ky;

          vectors.push([projectedV1, projectedV2, projectedV3, dotProductForLight]);
        }
      }
    }

    vectors.sort((a, b) => { return (b[0].z + b[1].z + b[2].z) / 3 - (a[0].z + a[1].z + a[2].z) / 3})

    for (let i = 0; i < vectors.length; i++) {

      // const lineColor = coords[3];
      // const fillColor = i < 16 ? coords[3] : undefined;

      // const lineColor = `#fff`;
      // const fillColor = `#fff`;

      const lineColor = `hsl(0, 0%, ${vectors[i][3] * 100}%)`;
      const fillColor = `hsl(0, 0%, ${vectors[i][3] * 100}%)`;
      const triangle = new Triangle(vectors[i][0].x, vectors[i][0].y, vectors[i][1].x, vectors[i][1].y, vectors[i][2].x, vectors[i][2].y, lineColor, fillColor);

      camera.drawScene(triangle.getPoints());
    }
    if (window.render) {
      requestAnimationFrame(cameraRender);
    }
  }

  if (window.render) {
    requestAnimationFrame(cameraRender);
  }

  document.body.addEventListener('keydown', (e) => {
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
    if (e.code === 'KeyD') {
      vCamera = new Vector(vCamera.x - 0.1, vCamera.y, vCamera.z);
    }
    if (e.code === 'KeyA') {
      vCamera = new Vector(vCamera.x + 0.1, vCamera.y, vCamera.z);
    }
    const vForward = vLookDir.multiplyVectorToScalar(0.1);
    if (e.code === 'KeyW') {
      vCamera = vCamera.subtractVectorFromVector(vForward);
      // vCamera = new Vector(vCamera.x, vCamera.y, vCamera.z - 0.5);
    }
    if (e.code === 'KeyS') {
      vCamera = vCamera.addVectorToVector(vForward);
      // vCamera = new Vector(vCamera.x, vCamera.y, vCamera.z + 0.5);
    }
    if (e.code === 'ArrowUp') {
      vCamera = new Vector(vCamera.x, vCamera.y - 0.1, vCamera.z);
    }
    if (e.code === 'ArrowDown') {
      vCamera = new Vector(vCamera.x, vCamera.y + 0.1, vCamera.z);
    }
    if (e.code === 'ArrowLeft') {
      player.yaw -= 2;
    }
    if (e.code === 'ArrowRight') {
      player.yaw += 2;
    }
  });
}
