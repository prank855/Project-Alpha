import { GameComponent } from "./GameComponent";

export class GameObject {
  static lastID: number = 0;
  private components: GameComponent[] = [];
  id: number;
  name: string;
  constructor(name?: string) {
    this.id = GameObject.lastID++;
    this.name = name || `Game Object ${this.id}`;
  }
  update() {
    for (var co of this.components) {
      co.update();
    }
  }
  render() {
    for (var co of this.components) {
      co.render();
    }
  }
  addComponent(co: GameComponent) {
    co.parent = this;
    co.init();
    this.components.push(co);
  }

  getComponent(componentName: string): GameComponent | null {
    for (var co of this.components) {
      if (co.constructor.name == componentName) {
        return co;
      }
    }
    return null;
  }
}
