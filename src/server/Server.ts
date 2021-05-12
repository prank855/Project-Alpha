import { GameObjectManager } from "../shared/GameObjectManager";
import WebSocket from "ws";
import { Time } from "../server/Time";
export class Server {
  tickRate: number;
  tick: number = 0;
  lastTime: number = 0;
  objectManager: GameObjectManager = new GameObjectManager();
  wss: WebSocket.Server;
  constructor(ws: WebSocket.Server, tickrate?: number) {
    this.tickRate = tickrate || 20;
    this.wss = ws;
    console.log("Server Created with tickrate of", this.tickRate);
  }
  start() {
    console.log("Server Started");
    this.lastTime = Time.getCurrTime();
    this.loop();
  }

  private frameTimeList: number[] = [];
  private setIntervalError: number = 2; //Error in milliseconds that setInterval causes for proper consistent frametimes
  loop() {
    let currTime = Time.getCurrTime();
    let self = this;
    //check if ready for next loop
    let tickDelta = 1000 / this.tickRate;
    if (currTime - this.lastTime < tickDelta) {
      if (currTime - this.lastTime + this.setIntervalError < tickDelta) {
        setTimeout(self.loop.bind(this));
      } else {
        setImmediate(self.loop.bind(this));
      }
      return;
    }
    //start actual loop
    this.tick++;
    Time.deltaTime = (currTime - this.lastTime) / 1000;
    Time.elapsedTime += Time.deltaTime;
    this.lastTime = currTime;
    this.frameTimeList.push(Time.deltaTime);

    //Update
    this.objectManager.update();
    //
    if (this.tick % (this.tickRate * 5) == 0) {
      let b = 0;
      for (let a of this.frameTimeList) {
        b += a;
      }
      console.log(
        "Tick",
        this.tick,
        "| Tick Rate:",
        (1 / (b / this.frameTimeList.length)).toFixed(2),
        "|",
        Time.elapsedTime.toFixed(2),
        "seconds |",
        this.objectManager.getObjectListSize(),
        "objects."
      );
      this.frameTimeList = [];
    }

    let temp: any = {};
    temp.type = "Server Tick";
    temp.tick = this.tick;
    setImmediate(this.loop.bind(this));
  }
}
