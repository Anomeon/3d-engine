import { Drawer } from '../Drawer';
import { Vector } from './Vector';

const drawer = new Drawer();

export class Point {
  constructor(private x: number, private y: number, private z: number) {
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
    const size = this.z / 10;
    const x = this.x - size / 2
    const y = this.y - size / 2

    drawer.draw(x, y, size, size);
  }

  setPointToPoint(point: Point) {
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
  }
}