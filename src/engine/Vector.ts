type Matrix1 = [number, number, number];
type Matrix3 = [Matrix1, Matrix1, Matrix1];

export class Vector {
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