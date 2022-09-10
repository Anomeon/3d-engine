import { Point } from './Point';

export class Camera {
  constructor(private minX: number, private maxX: number, private minY: number, private maxY: number, private minZ: number, private maxZ: number) {}

  shouldDraw(point: Point) {
    return point.x >= this.minX && point.x <= this.maxX && point.y >= this.minY && point.y <= this.maxY && point.z >= this.minZ && point.z <= this.maxZ;
  }

  drawScene (points: Point[]) {
    for (let i = 0; i < points.length; i++) {
      if (this.shouldDraw(points[i])) points[i].draw();
    }
  }
}