import { Matrix3x3, MathExt } from "./MathExt";

export class Vector {
  constructor(public x: number, public y: number, public z: number) {}

  addVectorToVector(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtractVectorFromVector(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  multiplyVectorToScalar(k: number) {
    return new Vector(this.x * k, this.y * k, this.z * k);
  }

  crossProduct(vector: Vector) {
    const x = this.y * vector.z - this.z * vector.y;
    const y = this.z * vector.x - this.x * vector.z;
    const z = this.x * vector.y - this.y * vector.x;
    return new Vector(x, y, z);
  }

  dotProduct(vector: Vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  unitVector() {
    const length = this.length();

    if (length === 0) {
      return new Vector(0, 0, 0);
    }
    return new Vector(this.x / length, this.y / length, this.z / length);
  }

  length() {
    return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
  }

  getDebugValue() {
    return `${this.x} ${this.y} ${this.z}`;
  }

  private rotate(rotationMatrix: Matrix3x3) {
    const newMatrix1 = MathExt.multiplyMatrix(rotationMatrix, [this.x, this.y, this.z]);
    return new Vector(newMatrix1[0], newMatrix1[1], newMatrix1[2]);
  }

  rotateXY(degrees: number) {
    const radian = MathExt.degreeToRadian(degrees);
    const rotationMatrix: Matrix3x3 = [
      [Math.cos(radian), -Math.sin(radian), 0],
      [Math.sin(radian), Math.cos(radian), 0],
      [0, 0, 1],
    ];
    return this.rotate(rotationMatrix);
  }

  rotateXZ(degrees: number) {
    const radian = MathExt.degreeToRadian(degrees);
    const rotationMatrix: Matrix3x3 = [
      [Math.cos(radian), 0, Math.sin(radian)],
      [0, 1, 0],
      [-Math.sin(radian), 0, Math.cos(radian)],
    ];
    return this.rotate(rotationMatrix);
  }

  rotateYZ(degrees: number) {
    const radian = MathExt.degreeToRadian(degrees);
    const rotationMatrix: Matrix3x3 = [
      [1, 0, 0],
      [0, Math.cos(radian), -Math.sin(radian)],
      [0, Math.sin(radian), Math.cos(radian)],
    ];
    return this.rotate(rotationMatrix);
  }

  scale(x: number, y:number, z:number) {
    const scaleMatrix: Matrix3x3 = [
      [x, 0, 0],
      [0, y, 0],
      [0, 0, z],
    ];
    const scaledMatrix = MathExt.multiplyMatrix(scaleMatrix, [this.x, this.y, this.z]);
    return new Vector(scaledMatrix[0], scaledMatrix[1], scaledMatrix[2])
  }
}

// @ts-ignore
window.Vector = Vector;