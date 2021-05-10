import { GameComponent } from "./GameComponent";
import { Vector2 } from "./Vector2";

export class Transform extends GameComponent {
  position: Vector2 = new Vector2();
  constructor() {
    super();
  }
}
