import { Drawer } from './Drawer';
import { Point } from './engine/Point';
import { Vector } from './engine/Vector';

const canvas = document.querySelector('canvas');

const ctx = canvas?.getContext('2d');

const deep = 300;

const point1 = new Point(1, 2, 1);
const point2 = new Point(0, 4, 4);
const vector1 = new Vector(2, 0, 0);
const vector2 = point1.subtractPointFromPoint(point2);
const vector3 = vector1.addVectorToVector(vector2);

// Asserts
console.log("point1.getDebugValue() === '1 2 1'", point1.getDebugValue() === '1 2 1');
console.log("vector2.getDebugValue() === '1 -2 -3'", vector2.getDebugValue() === '1 -2 -3');
console.log("vector3.getDebugValue() === '3 -2 -3'", vector3.getDebugValue() === '3 -2 -3');
console.log("point1.addVectorToPoint(vector3).getDebugValue() === '4 0 -2'", point1.addVectorToPoint(vector3).getDebugValue() === '4 0 -2');
console.log("point2.subtractVectorFromPoint(vector2).getDebugValue() === '-1 6 7'", point2.subtractVectorFromPoint(vector2).getDebugValue() === '-1 6 7');

console.log("new Vector(3, 4, 5)).rotateXY(90).getDebugValue() === '-4 3 5'", (new Vector(3, 4, 5)).rotateXY(90).getDebugValue() === '-4 3 5')
console.log("(new Vector(3, 4, 0)).scale(2, 1, 1).getDebugValue() === '6 4 0'", (new Vector(3, 4, 0)).scale(2, 1, 1).getDebugValue() === '6 4 0')

if (canvas && ctx) {
  ctx.fillStyle = '#fff';

  new Drawer(ctx);

  const getPoints = () => {
    const points: Point[] = [];
    for (let i = 0; i < 100; i++) {
      points.push(new Point(Math.random() * canvas?.width, Math.random() * canvas?.height, Math.random() * deep))
    }

    return points;
  }

  let points = getPoints();


  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
      points[i].draw();
    }
  }

  document.body.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      points = getPoints();
      render();
    }
    if (e.code === 'KeyA') {
      const origin = new Point(canvas.width / 2, canvas.height / 2, deep / 2);

      for (let i = 0; i < points.length; i++) {
        const pointVector = points[i].subtractPointFromPoint(origin);
        points[i].setPointToPoint(origin);
        points[i] = points[i].addVectorToPoint(pointVector.scale(0.9, 0.9, 0.9));
      }
      render();
    }
    if (e.code === 'KeyS') {
      const origin = new Point(canvas.width / 2, canvas.height / 2, deep / 2);

      for (let i = 0; i < points.length; i++) {
        const pointVector = points[i].subtractPointFromPoint(origin);
        points[i].setPointToPoint(origin);
        points[i] = points[i].addVectorToPoint(pointVector.scale(1.1, 1.1, 1.1));
      }
      render();
    }
    if (e.code === 'KeyR') {
      const origin = new Point(canvas.width / 2, canvas.height / 2, deep / 2);

      for (let i = 0; i < points.length; i++) {
        const pointVector = points[i].subtractPointFromPoint(origin);
        points[i].setPointToPoint(origin);
        points[i] = points[i].addVectorToPoint(pointVector.rotateYZ(5));
      }
      render();
    }
    if (e.code === 'KeyE') {
      const origin = new Point(canvas.width / 2, canvas.height / 2, deep / 2);

      for (let i = 0; i < points.length; i++) {
        const pointVector = points[i].subtractPointFromPoint(origin);
        points[i].setPointToPoint(origin);
        points[i] = points[i].addVectorToPoint(pointVector.rotateYZ(-5));
      }
      render();
    }
  });

  render();
}
