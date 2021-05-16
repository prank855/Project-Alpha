import { Scene } from './Scene';
import { GameComponent } from './GameComponent';
import { Transform } from './Transform';

export class GameObject {
	static lastID: number = 0;
	isActive: boolean = true;
	scene: Scene | null = null;
	transform = new Transform();
	components: GameComponent[] = [];
	id: number = 0;
	name: string = 'Unnamed Game Object';
	started: boolean = false;

	delete: boolean = false;

	constructor() {}
	update() {
		for (let co of this.components) {
			if (co.isActive) {
				co.update();
			}
		}
	}

	addComponent(co: GameComponent) {
		if (this.getComponent(co.name) != null) {
			console.log(
				`${co.name} already exists on this Game Object ID:${this.id}`
			);
			return;
		}
		co.parent = this;
		co.init();
		this.components.push(co);
	}

	start() {
		for (let co of this.components) {
			co.start();
		}
	}

	getComponent(componentName: string): GameComponent | null {
		for (let co of this.components) {
			if (co.name == componentName) {
				return co;
			}
		}
		return null;
	}
	getComponents(): GameComponent[] {
		return this.components;
	}
}
