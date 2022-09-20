export class Drawer {
  static instance?: CanvasRenderingContext2D;
  private ctx?: CanvasRenderingContext2D;

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = Drawer.instance ? Drawer.instance : ctx;
    Drawer.instance = Drawer.instance ? Drawer.instance : ctx;
  }

  draw(x: number, y: number, width: number, height: number) {
    // TODO
    Drawer.instance?.fillRect(x, 600 - y, width, height);
  }

  color(color: string) {
    if (Drawer.instance) {
      Drawer.instance.fillStyle = color;
    }
  }
}
