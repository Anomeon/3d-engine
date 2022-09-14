import { Line } from "./Line";
import { Point } from "./Point";

export class Triangle {
  constructor(
    private point1x: number,
    private point1y: number,
    private point2x: number,
    private point2y: number,
    private point3x: number,
    private point3y: number,
    private color: string = '#fff',
  ) {}

  getPoints() {
    const points: Point[] = [];
    points.push(
      ...(new Line(
        this.point1x, this.point1y,
        this.point2x, this.point2y,
        this.color,
      )).getPoints()
    );
    points.push(
      ...(new Line(
        this.point2x, this.point2y,
        this.point3x, this.point3y,
        this.color,
      )).getPoints()
    );
    points.push(
      ...(new Line(
        this.point3x, this.point3y,
        this.point1x, this.point1y,
        this.color,
      )).getPoints()
    );

    return points;
  }
}