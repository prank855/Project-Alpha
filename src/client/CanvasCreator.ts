export class CanvasCreator {
  static canvas: HTMLCanvasElement;
  static context: CanvasRenderingContext2D | null;
  static initializeCanvas(width: number, height: number) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }
}
