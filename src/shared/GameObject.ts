import { GameComponent } from "./GameComponent";

export class GameObject {
  components: GameComponent[] = [];
  constructor() {}
  update() {
    for (var co of this.components) {
      co.update();
    }
  }
}
