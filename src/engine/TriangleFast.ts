import { Line } from "./Line";
import { Point } from "./Point";
import { Drawer } from "../Drawer";

export class TriangleFast {
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

  draw() {
    Drawer.instance.fillStyle = this.fill;
    Drawer.instance.strokeStyle = 'transparent';
    Drawer.instance.beginPath();
    Drawer.instance.moveTo(this.point1x, this.point1y);
    Drawer.instance.lineTo(this.point2x, this.point2y);
    Drawer.instance.lineTo(this.point3x, this.point3y);
    Drawer.instance.fill();
  }
}