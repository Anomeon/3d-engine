import { Drawer } from './Drawer';
import { Point } from './engine/Point';
import { Vector } from './engine/Vector';
import { Camera } from './engine/Camera';
import { Line } from './engine/Line';
import { Triangle } from './engine/Triangle';
import { Polygon } from './engine/Polygon';
import { MathExt } from './engine/MathExt';

const canvas = document.querySelector('canvas');

const ctx = canvas?.getContext('2d');

let cameraState = {x: 0, y: 0, z: 0, xy: 0, xz: 0, yz: 0, shift: false };

document.body.addEventListener('keydown', (e) => {
  if (e.code === 'ShiftLeft') {

    cameraState.shift = true;
  }
});

document.body.addEventListener('keyup', (e) => {
  if (e.code === 'ShiftLeft') {

    cameraState.shift = false;
  }
});

document.body.addEventListener('mousemove', (e) => {
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
});

if (canvas && ctx) {
  ctx.fillStyle = '#fff';

  new Drawer(ctx);
  const camera = new Camera(0, canvas?.width, 0, canvas?.height);

  const cameraRender = (timestamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cube = Object.freeze([
      // east
      [[1, 0, 0],   [1, 1, 0],   [1, 1, 1], 'yellow', ],
      [[1, 0, 0],   [1, 1, 1],   [1, 0, 1], 'yellow', ],

      // top
      [[0, 1, 0],   [0, 1, 1],   [1, 1, 1], 'green', ],
      [[0, 1, 0],   [1, 1, 1],   [1, 1, 0], 'green', ],

      // north
      [[1, 0, 1],   [1, 1, 1],   [0, 0, 1], 'white', ],
      [[1, 1, 1],   [0, 1, 1],   [0, 0, 1], 'white', ],

      // bottom
      [[0, 0, 1],   [0, 0, 0],   [1, 0, 1], 'pink', ],
      [[0, 0, 0],   [1, 0, 0],   [1, 0, 1], 'pink', ],

      // south
      [[0, 0, 0],   [0, 1, 0],   [1, 1, 0], 'red', ],
      [[0, 0, 0],   [1, 1, 0],   [1, 0, 0], 'red', ],

      // west
      [[0, 0, 1],   [0, 1, 1],   [0, 0, 0], 'blue', ],
      [[0, 1, 1],   [0, 1, 0],   [0, 0, 0], 'blue', ],
    ]);

    for (let i = 0; i < cube.length; i++) {
      const coords: [number[], number[], number[], string] = cube[i] as [number[], number[], number[], string];

      let v1 = new Vector(coords[0][0], coords[0][1], coords[0][2]);
      let v2 = new Vector(coords[1][0], coords[1][1], coords[1][2]);
      let v3 = new Vector(coords[2][0], coords[2][1], coords[2][2]);

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
      v1.x = v1.x - 0.5;
      v2.x = v2.x - 0.5;
      v3.x = v3.x - 0.5;

      v1.y = v1.y - 0.5;
      v2.y = v2.y - 0.5;
      v3.y = v3.y - 0.5;

      v1.z = v1.z + 2.5;
      v2.z = v2.z + 2.5;
      v3.z = v3.z + 2.5;

      const diffV2V1 = v2.subtractVectorFromVector(v1);
      const diffV3V1 = v3.subtractVectorFromVector(v1);
      const normal = diffV2V1.crossProduct(diffV3V1);

      const unitNormal = normal.unitVector();

      const lightDirectionNormal = new Vector(0, 0, -1).unitVector();
      const dotProductForLight = unitNormal.dotProduct(lightDirectionNormal);

      if (unitNormal.dotProduct(v1.subtractVectorFromVector(new Vector(camera.minX, camera.minY, camera.minZ))) < 0) {
        const projectedV1 = MathExt.multiplyVectorToMatrix(v1, camera.projectionMatrix);
        const projectedV2 = MathExt.multiplyVectorToMatrix(v2, camera.projectionMatrix);
        const projectedV3 = MathExt.multiplyVectorToMatrix(v3, camera.projectionMatrix);

        const k = 300;
        const x = 400;
        const y = 300;

        // const lineColor = coords[3];
        // const fillColor = i < 16 ? coords[3] : undefined;
        const lineColor = `hsl(0, 0%, ${dotProductForLight * 100}%)`;
        const fillColor = i < 16 && dotProductForLight > 0 ? `hsl(0, 0%, ${dotProductForLight * 100}%)` : undefined;
        camera.drawScene((new Triangle(projectedV1.x * k + x, projectedV1.y * k + y, projectedV2.x * k + x, projectedV2.y * k + y, projectedV3.x * k + x, projectedV3.y * k + y, lineColor, fillColor).getPoints()));
      }
    }
    requestAnimationFrame(cameraRender);
  }

  requestAnimationFrame(cameraRender);
}
