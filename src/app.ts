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

if (canvas && ctx) {
  ctx.fillStyle = '#fff';

  new Drawer(ctx);
  const camera = new Camera(0, canvas?.width, 0, canvas?.height);

  const cameraRender = (timestamp) => {

    const colors = [
      'red',
      'blue',
      'green',
      'yellow',
      'white',
      'pink',
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cube = [
      // south
      [0, 0, 0,   0, 1, 0,   1, 1, 0],
      [0, 0, 0,   1, 1, 0,   1, 0, 0],

      // // west
      [0, 0, 1,   0, 1, 1,   0, 0, 0],
      [0, 1, 1,   0, 1, 0,   0, 0, 0],

    //   // top
      [0, 1, 0,   0, 1, 1,   1, 1, 1],
      [0, 1, 0,   1, 1, 1,   1, 1, 0],

    //   // east
      [1, 0, 0,   1, 1, 0,   1, 1, 1],
      [1, 0, 0,   1, 1, 1,   1, 0, 1],

    //   // north
      [1, 0, 1,   1, 1, 1,   0, 0, 1],
      [1, 1, 1,   0, 1, 1,   0, 0, 1],

    //   // bottom
      [0, 0, 1,   0, 0, 0,   1, 0, 1],
      [0, 0, 0,   1, 0, 0,   1, 0, 1],
    ];

    // const cube = [
    //   // south
    //   [1, 1, 1,   1, 100, 1,   100, 100, 1],
    //   [1, 1, 1,   100, 100, 1,   100, 1, 1],

      // // west
      // [50, 50, 100,   50, 100, 100,   50, 50, 50],
      // [50, 100, 100,   50, 100, 50,   50, 50, 50],

      // // top
      // [50, 100, 50,   50, 100, 100,   100, 100, 100],
      // [50, 100, 50,   100, 100, 100,   100, 100, 50],

      // // east
      // [100, 50, 50,   100, 100, 50,   100, 100, 100],
      // [100, 50, 50,   100, 100, 100,   100, 50, 100],

      // // north
      // [100, 50, 100,   100, 100, 100,   50, 50, 100],
      // [100, 100, 100,   50, 100, 100,   50, 50, 100],

      // // bottom
      // [50, 50, 100,   50, 50, 50,   100, 50, 100],
      // [50, 50, 50,   100, 50, 50,   100, 50, 100],
    // ];

    for (let i = 0; i < cube.length; i++) {
      const triangle = cube[i];

      let v1 = new Vector(triangle[0], triangle[1], triangle[2]);
      let v2 = new Vector(triangle[3], triangle[4], triangle[5]);
      let v3 = new Vector(triangle[6], triangle[7], triangle[8]);

      // Rotate
      v1 = v1.rotateYZ(MathExt.round(timestamp / 15 % 360));
      v2 = v2.rotateYZ(MathExt.round(timestamp / 15 % 360));
      v3 = v3.rotateYZ(MathExt.round(timestamp / 15 % 360));

      v1 = v1.rotateXY(MathExt.round(timestamp / 15 % 360));
      v2 = v2.rotateXY(MathExt.round(timestamp / 15 % 360));
      v3 = v3.rotateXY(MathExt.round(timestamp / 15 % 360));

      v1 = v1.rotateXZ(MathExt.round(timestamp / 15 % 360));
      v2 = v2.rotateXZ(MathExt.round(timestamp / 15 % 360));
      v3 = v3.rotateXZ(MathExt.round(timestamp / 15 % 360));

      // Add perspective
      // Very affects how 3d objects looks like!
      v1.z = v1.z + 3.5;
      v2.z = v2.z + 3.5;
      v3.z = v3.z + 3.5;

      const projectedV1 = MathExt.multiplyVectorToMatrix(v1, camera.projectionMatrix);
      const projectedV2 = MathExt.multiplyVectorToMatrix(v2, camera.projectionMatrix);
      const projectedV3 = MathExt.multiplyVectorToMatrix(v3, camera.projectionMatrix);
      const k = 450;
      const x = 300;
      const y = 200;
      camera.drawScene((new Triangle(projectedV1.x * k + x, projectedV1.y * k + y, projectedV2.x * k + x, projectedV2.y * k + y, projectedV3.x * k + x, projectedV3.y * k + y, colors[Math.ceil(i / 2)]).getPoints()));
    }

    requestAnimationFrame(cameraRender);
  }

  requestAnimationFrame(cameraRender);
}
