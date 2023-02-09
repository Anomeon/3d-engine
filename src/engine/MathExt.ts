import { Vector } from "./Vector";

export type Matrix1x3 = [number, number, number];
export type Matrix3x3 = [Matrix1x3, Matrix1x3, Matrix1x3];

export type Matrix1x4 = [number, number, number, number];
export type Matrix4x4 = [Matrix1x4, Matrix1x4, Matrix1x4, Matrix1x4];

export type Matrix1xN = Matrix1x3 | Matrix1x4;
export type MatrixNxN = Matrix3x3 | Matrix4x4;

export class MathExt {
  // firstly multiplying row
  static multiplyMatrix(matrixNxN: MatrixNxN, matrix1xN: Matrix1xN) {
    const newMatrix1xN = Array(matrixNxN.length).fill(0);
    for (let i = 0; i < matrixNxN.length; i++) {
      for (let j = 0; j < matrixNxN[i].length; j++) {
        newMatrix1xN[i] += this.round(matrixNxN[i][j] * matrix1xN[j]);
      }
    }
    return newMatrix1xN;
  }

  static multiplyVectorToMatrix(v: Vector, m: Matrix4x4) {
    const x = MathExt.round(v.x * m[0][0] + v.y * m[1][0] + v.z * m[2][0] + v.w * m[3][0]);
    const y = MathExt.round(v.x * m[0][1] + v.y * m[1][1] + v.z * m[2][1] + v.w * m[3][1]);
    const z = MathExt.round(v.x * m[0][2] + v.y * m[1][2] + v.z * m[2][2] + v.w * m[3][2]);
    const w = MathExt.round(v.x * m[0][3] + v.y * m[1][3] + v.z * m[2][3] + v.w * m[3][3]);

    return new Vector(x, y, z, w);
  }

  static random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static degreeToRadian(degree: number) {
    return degree * Math.PI / 180;
  }

  static round(number: number, precision: number = 2) {
    return +number.toFixed(precision);
  }
}