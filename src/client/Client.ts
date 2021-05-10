import { GameObjectManager } from "../shared/GameObjectManager";
import { Time } from "../client/Time";
import { CanvasCreator } from "./CanvasCreator";
export class Client {
  objectManager: GameObjectManager = new GameObjectManager();
  lastTime: number = Time.getCurrTime();
  frame: number = 0;
  gameName: string = "Unnamed Game";
  private debug: boolean = true;
  private ctx: CanvasRenderingContext2D | null;
  constructor(gameName: string) {
    this.gameName = gameName || "Unnamed Game";
    CanvasCreator.initializeCanvas(1280, 720);
    if (CanvasCreator.context == null) {
      throw "canvas context is null";
    }
    this.ctx = CanvasCreator.context;
    console.log("Client Created");
  }
  start() {
    console.log("Client Started");

    this.loop();
  }
  loop() {
    this.frame++;
    var currTime = Time.getCurrTime();
    Time.deltaTime = currTime - this.lastTime;
    Time.elapsedTime += Time.deltaTime;
    this.lastTime = currTime;
    this.ctx!.fillStyle = "cornflowerblue";
    this.ctx!.fillRect(0, 0, 1280, 720);

    if (this.frame % (165 * 5) == 0) {
      console.log("FPS: ", 1 / Time.deltaTime);
    }
    if (this.debug) {
      this.ctx!.fillStyle = "rgba(0,0,0,0.5)";
      this.ctx!.fillRect(0, 0, 265, 75 + 15);
      this.ctx!.fillStyle = "white";
      this.ctx!.font = "15px Consolas";
      this.ctx!.fillText(this.gameName, 10, 15);
      this.ctx!.fillText("Framerate: " + Math.ceil(1 / Time.deltaTime), 10, 30);
      this.ctx!.fillText(
        "Frametime: " + Math.round(Time.deltaTime * 100000) / 100 + "ms",
        10,
        45
      );
      this.ctx!.fillText(
        "Elapsed: " + Math.round(Time.elapsedTime / 10) / 100 + " seconds",
        10,
        60
      );
      this.ctx!.fillText("Frame: " + this.frame, 10, 75);
    }

    this.objectManager.update();
    requestAnimationFrame(this.loop.bind(this));
  }
}
