import { GameComponent } from './GameComponent';
import { InputAction } from './InputAction';

export class GameObject {
	static lastID: number = 0;
	components: GameComponent[] = [];
	id: number;
	networkID: number | null = null;
	name: string;
	started: boolean = false;
	isNetworked: boolean = true;
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
	onDebug() {
		for (let co of this.components) {
			if (co.debug) co.onDebug();
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
