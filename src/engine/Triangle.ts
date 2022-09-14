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
    private fill?: string,
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

    if (this.fill) {
      // Collect all y coordinates
      let yDict = {};

      for (let i = 0; i < points.length; i++) {
        if (yDict[points[i].y] === undefined) {
          yDict[points[i].y] = [];
        }
        yDict[points[i].y].push(points[i].x);
      }
      for (let key in yDict) {
        // Simple case
        if (yDict[key].length === 2) {
          // Calc diff and build horizontal line
          if (Math.abs(yDict[key][1] - yDict[key][0]) >= 2) {
            points.push(...(new Line(yDict[key][0], Number(key), yDict[key][1], Number(key), this.fill)).getPoints());
          }
        }

        // More than two x coordinates per y
        if (yDict[key].length > 2) {
          for (let j = 0; j < yDict[key].length - 1; j++) {
            // Calc diff for all x pairs and build horizontal line
            if (Math.abs(yDict[key][j + 1] - yDict[key][j]) >= 2) {
              points.push(...(new Line(yDict[key][j], Number(key), yDict[key][j + 1], Number(key), this.fill)).getPoints());
            }
          }
        }
      }
    }

    return points;
  }
}