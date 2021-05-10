import { GameObject } from "./GameObject";

export class GameObjectManager {
  private gameObjects: GameObject[] = [];
  addGameObject(go: GameObject) {
    this.gameObjects.push(go);
  }
  getObjectListSize() {
    return this.gameObjects.length;
  }
  update() {
    for (var go of this.gameObjects) {
      go.update();
    }
  }
}
