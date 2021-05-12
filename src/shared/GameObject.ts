import { GameComponent } from './GameComponent';
import { InputAction } from './InputAction';

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
		for (let co of this.components) {
			co.update();
		}
	}
	input(inputs: InputAction[]) {
		for (let co of this.components) {
			co.input(inputs);
		}
	}
	render() {
		for (let co of this.components) {
			co.render();
		}
	}
	debug() {
		for (let co of this.components) {
			co.debug();
		}
	}
	addComponent(co: GameComponent) {
		co.parent = this;
		co.init();
		this.components.push(co);
	}

	getComponent(componentName: string): GameComponent | null {
		for (let co of this.components) {
			if (co.constructor.name == componentName) {
				return co;
			}
		}
		return null;
	}
	getComponents(): GameComponent[] {
		return this.components;
	}
}
