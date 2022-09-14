import { MathExt } from "./MathExt";
import { Point } from "./Point";

export class Line {
  constructor(private startX: number, private startY: number, private endX: number, private endY: number, private color: string = '#fff') {
    this.startX = MathExt.round(startX, 0);
    this.startY = MathExt.round(startY, 0);
    this.endX = MathExt.round(endX, 0);
    this.endY = MathExt.round(endY, 0);
  }

  getPoints() {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    // abs for y1 = 10, y2 = 1 case
    const deltaYError = (Math.abs(dy) + 1)/(Math.abs(dx) + 1);
    const deltaXError = (Math.abs(dx) + 1)/(Math.abs(dy) + 1);
    const yDirection = dy > 0 ? 1 : -1;
    const xDirection = dx > 0 ? 1 : -1;

    const points: Point[] = [];
    let error = 0;
    let x = this.startX;
    let y = this.startY;

    let i = 0;
    points.push(new Point(x, y, 1));
    while (!((x === this.endX) && (y === this.endY))) {
      // TODO remove
      i++;
      if (i > 1000) {
        console.log('break');
        break;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        if (this.startX !== this.endX) {
          x += xDirection;
        }
        error += deltaYError;
        // '=' for x1 = 10, y1 = 10, x2 = 11, y2 = 11 case
        if (error >= 1) {
          y += yDirection;
          error--;
        }
      } else {
        if (this.startY !== this.endY) {
          y += yDirection;
        }
        error += deltaXError;
        if (error >= 1) {
          x += xDirection;
          error--;
        }
      }
      // TODO 1
      points.push(new Point(x, y, 1, this.color));
    }
    return points;
  }
}