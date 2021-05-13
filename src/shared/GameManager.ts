import { GameObjectManager } from './GameObjectManager';
import { Scene } from './Scene';
export class GameManager {
	currentScene: Scene | null = null;
	objectManager: GameObjectManager = new GameObjectManager();
	gameName: string = 'Unnamed Game';

	start() {
		console.log('EPIC');
	}
	update() {}
	createScene(scene: Scene, objectManager: GameObjectManager) {
		this.currentScene = scene;
		this.currentScene.create(objectManager);
	}
	onDebug() {}
	getGameState() {}
}
