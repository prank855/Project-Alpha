import { Input } from '../client/Input';
import { GameObject } from './GameObject';

export class GameObjectManager {
	private gameObjects: GameObject[] = [];
	addGameObject(go: GameObject) {
		this.gameObjects.push(go);
		console.log(`Added GameObject ID ${go.id}`);
	}
	getObjectListSize(): number {
		return this.gameObjects.length;
	}
	update() {
		for (var go of this.gameObjects) {
			go.update();
		}
	}
	input() {
		var inputs = Input.GetInputs();
		for (var go of this.gameObjects) {
			go.input(inputs);
		}
	}
	render() {
		for (var go of this.gameObjects) {
			go.render();
		}
	}
	debug() {
		for (var go of this.gameObjects) {
			go.debug();
		}
	}
}
