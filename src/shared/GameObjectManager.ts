import { GameObject } from "./GameObject";

export class GameObjectManager {
  private gameObjects: GameObject[] = [];
  addGameObject(go: GameObject) {
    this.gameObjects.push(go);
    console.log(`Added GameObject ID ${go.id}`);
  }
  getObjectListSize() {
    return this.gameObjects.length;
  }
  update() {
    for (var go of this.gameObjects) {
      go.update();
    }
  }
  render() {
    for (var go of this.gameObjects) {
      go.render();
    }
  }
}
