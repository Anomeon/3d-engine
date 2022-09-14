import { Drawer } from '../Drawer';
import { Vector } from './Vector';

const drawer = new Drawer();

export class Point {
  constructor(public x: number, public y: number, public z: number, public color: string = '#fff') {
  }

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
    drawer.color(this.color);
    drawer.draw(this.x, this.y, 1, 1);
  }

  setPointToPoint(point: Point) {
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
  }
}

// @ts-ignore
window.Point = Point;