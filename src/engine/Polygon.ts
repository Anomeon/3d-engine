import { Line } from "./Line";
import { Point } from "./Point";

export class Polygon {
  constructor(private points: number[]) {}

  getPoints() {
    let points: Point[] = [];

    for (let i = 0; i < this.points.length; i += 2) {
      if (i !== this.points.length - 2) {
        points.push(
          ...(new Line(this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3])).getPoints()
        );
      } else {
        points.push(
          ...(new Line(this.points[i], this.points[i + 1], this.points[0], this.points[1]).getPoints()),
        );
      }
    }

    return points;
  }
}