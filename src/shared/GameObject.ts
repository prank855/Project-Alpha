import { Vector2 } from './Vector2';
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

	children: GameObject[] = [];
	parent: GameObject | null = null;

	delete: boolean = false;

	constructor() {}
	update() {
		for (let go of this.children) {
			go.update();
		}
		for (let co of this.components) {
			if (co.isActive) {
				co.update();
			}
		}
	}

	getTransform(): Transform {
		if (this.parent == null) {
			return this.transform;
		} else {
			return new Transform(
				Vector2.copy(this.parent.getTransform().position).add(
					this.transform.position
				)
			);
		}
	}

	addChildGameObject(go: GameObject) {
		if (this.scene == null) {
			throw 'Game Object needs to be added to the scene before adding children.';
		}
		go.parent = this;
		go.scene = this.scene;
		this.children.push(go);
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
