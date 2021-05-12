import { Input } from '../client/Input';
import { GameObject } from './GameObject';

export class GameObjectManager {
	private gameObjects: GameObject[] = [];
	static self: GameObjectManager | null = null;
	constructor() {
		if (GameObjectManager.self == null) {
			GameObjectManager.self = this;
		} else {
			return;
		}
	}
	addGameObject(go: GameObject) {
		this.gameObjects.push(go);
		console.log(`Added GameObject ID ${go.id}, Name: ${go.name}`);
	}
	findGameObject(gameObjectName: string): GameObject | null {
		for (let go of this.gameObjects) {
			if (go.name == gameObjectName) {
				return go;
			}
		}
		return null;
	}
	getObjectListSize(): number {
		return this.gameObjects.length;
	}
	update() {
		for (let go of this.gameObjects) {
			if (go.started == false) {
				go.start();
				go.started = true;
			}
			go.update();
		}
	}
	input() {
		let inputs = Input.GetInputs();
		for (let go of this.gameObjects) {
			go.input(inputs);
		}
	}
	render() {
		for (let go of this.gameObjects) {
			go.render();
		}
	}
	onDebug() {
		for (let go of this.gameObjects) {
			go.onDebug();
		}
	}
}
