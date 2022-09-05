import { a } from './engine';

console.log(a);

const canvas = document.querySelector('canvas');

const ctx = canvas?.getContext('2d');

type Matrix1 = [number, number, number];
type Matrix3 = [Matrix1, Matrix1, Matrix1];


class Point {
  constructor(private x: number, private y: number, private z: number) {}

  addVectorToPoint(vector: Vector) {
    return new Point(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtractVectorFromPoint(vector: Vector) {
    return new Point(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  subtractPointFromPoint(point: Point) {
    return new Vector(this.x - point.x, this.y - point.y, this.z - point.z);
  }

  getDebugValue() {
    return `${this.x} ${this.y} ${this.z}`;
  }

  draw() {
    const size = this.z / 10;
    const x = this.x - size / 2
    const y = this.y - size / 2

    ctx?.fillRect(x, y, size, size);
  }

  setPointToPoint(point: Point) {
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
  }
}

class Vector {
  constructor(readonly x: number, readonly y: number, readonly z: number) {}

  addVectorToVector(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtractVectorFromVector(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  getDebugValue() {
    return `${this.x} ${this.y} ${this.z}`;
  }

  multiplyMatrix(matrix3: Matrix3, matrix1: Matrix1) {
    const newMatrix1 = Array(matrix3.length).fill(0);
    for (let i = 0; i < matrix3.length; i++) {
      for (let j = 0; j < matrix3[i].length; j++) {
        newMatrix1[i] += +(matrix3[i][j] * matrix1[j]).toFixed(16);;
      }
    }
    return newMatrix1;
  }

  degreeToRadian(degree: number) {
    return degree * Math.PI / 180;
  }

  rotate(rotationMatrix: Matrix3) {
    const newMatrix1 = this.multiplyMatrix(rotationMatrix, [this.x, this.y, this.z]);
    return new Vector(newMatrix1[0], newMatrix1[1], newMatrix1[2]);
  }

  rotateXY(degrees: number) {
    const radian = this.degreeToRadian(degrees);
    const rotationMatrix: Matrix3 = [
      [Math.cos(radian), -Math.sin(radian), 0],
      [Math.sin(radian), Math.cos(radian), 0],
      [0, 0, 1],
    ];
    return this.rotate(rotationMatrix);
  }

  rotateXZ(degrees: number) {
    const radian = this.degreeToRadian(degrees);
    const rotationMatrix: Matrix3 = [
      [Math.cos(radian), 0, Math.sin(radian)],
      [0, 1, 0],
      [-Math.sin(radian), 0, Math.cos(radian)],
    ];
    return this.rotate(rotationMatrix);
  }

  rotateYZ(degrees: number) {
    const radian = this.degreeToRadian(degrees);
    const rotationMatrix: Matrix3 = [
      [1, 0, 0],
      [0, Math.cos(radian), -Math.sin(radian)],
      [0, Math.sin(radian), Math.cos(radian)],
    ];
    return this.rotate(rotationMatrix);
  }

  scale(x: number, y:number, z:number) {
    const scaleMatrix: Matrix3 = [
      [x, 0, 0],
      [0, y, 0],
      [0, 0, z],
    ];
    const scaledMatrix = this.multiplyMatrix(scaleMatrix, [this.x, this.y, this.z]);
    return new Vector(scaledMatrix[0], scaledMatrix[1], scaledMatrix[2])
  }
}

const deep = 300;

const point1 = new Point(1, 2, 1);
const point2 = new Point(0, 4, 4);
const vector1 = new Vector(2, 0, 0);
const vector2 = point1.subtractPointFromPoint(point2);
const vector3 = vector1.addVectorToVector(vector2);

console.log("point1.getDebugValue() === '1 2 1'", point1.getDebugValue() === '1 2 1');
console.log("vector2.getDebugValue() === '1 -2 -3'", vector2.getDebugValue() === '1 -2 -3');
console.log("vector3.getDebugValue() === '3 -2 -3'", vector3.getDebugValue() === '3 -2 -3');
console.log("point1.addVectorToPoint(vector3).getDebugValue() === '4 0 -2'", point1.addVectorToPoint(vector3).getDebugValue() === '4 0 -2');
console.log("point2.subtractVectorFromPoint(vector2).getDebugValue() === '-1 6 7'", point2.subtractVectorFromPoint(vector2).getDebugValue() === '-1 6 7');

console.log("new Vector(3, 4, 5)).rotateXY(90).getDebugValue() === '-4 3 5'", (new Vector(3, 4, 5)).rotateXY(90).getDebugValue() === '-4 3 5')
console.log("(new Vector(3, 4, 0)).scale(2, 1, 1).getDebugValue() === '6 4 0'", (new Vector(3, 4, 0)).scale(2, 1, 1).getDebugValue() === '6 4 0')



if (canvas && ctx) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(10, 10, 50, 50);

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
