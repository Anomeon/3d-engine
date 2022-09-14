import { Point } from './Point';
import { MathExt, Matrix4x4 } from './MathExt';

export class Camera {
  public aspectRatio: number;
  public fovRad: number;
  public f: number;
  public projectionMatrix: Matrix4x4;

  constructor(
    public minX: number,
    public maxX: number,
    public minY: number,
    public maxY: number,
    public minZ: number = 0.1,
    public maxZ: number = 1000,
    public fov: number = 90,
  ) {
    const width = maxX - minX;
    const height = maxY - minY;
    this.aspectRatio = height / width;
    this.fovRad = MathExt.degreeToRadian(fov);
    this.f = 1 / Math.tan(this.fovRad * 0.5);

    this.projectionMatrix = [
      [this.aspectRatio * this.f, 0,      0,                                                  0],
      [0,                         this.f, 0,                                                  0],
      [0,                         0,      this.maxZ / (this.maxZ - this.minZ),                1],
      [0,                         0,      (-this.maxZ * this.minZ) / (this.maxZ - this.minZ), 0],
    ];
  }

  shouldDraw(point: Point) {
    return point.x >= this.minX && point.x <= this.maxX && point.y >= this.minY && point.y <= this.maxY && point.z >= this.minZ && point.z <= this.maxZ;
  }

  drawScene (points: Point[]) {
    for (let i = 0; i < points.length; i++) {
      if (this.shouldDraw(points[i])) points[i].draw();
    }
  }
}