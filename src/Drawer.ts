export class Drawer {
  static instance?: CanvasRenderingContext2D;
  private ctx?: CanvasRenderingContext2D;

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = Drawer.instance ? Drawer.instance : ctx;
    Drawer.instance = Drawer.instance ? Drawer.instance : ctx;
  }

  draw(x: number, y: number, width: number, height: number) {

    Drawer.instance?.fillRect(x, y, width, height);
  }

  color(color: string) {
    if (Drawer.instance) {
      Drawer.instance.fillStyle = color;
    }
  }
}
