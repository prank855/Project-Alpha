import { GameObject } from './GameObject';
import { Transform } from './Transform';

export class GameObjectManager {
	private gameObjects: GameObject[] = [];
	private gameObjectPool: GameObject[] = [];
	private initialPoolSize: number = 1000;
	constructor() {
		for (var i = 0; i < this.initialPoolSize; i++) {
			this.gameObjectPool.push(new GameObject(this));
		}
	}

	getPoolSize(): number {
		return this.gameObjectPool.length;
	}

	createGameObject(gameObjectName: string): GameObject {
		var go = this.gameObjectPool.shift();
		if (!go) {
			go = new GameObject(this);
		}

		//Resets Game Object to defaults;
		go.id = GameObject.lastID++;
		go.components.length = 0;
		go.transform = new Transform();
		go.name = gameObjectName;

		return go;
	}

	addGameObject(go: GameObject) {
		this.gameObjects.push(go);
		//console.log(`Added GameObject ID ${go.id}, Name: ${go.name}`);
	}

	findGameObjectByName(gameObjectName: string): GameObject | null {
		for (let go of this.gameObjects) {
			if (go.name == gameObjectName) {
				return go;
			}
		}
		return null;
	}

	findGameObjectByID(gameObjectID: number): GameObject | null {
		for (let go of this.gameObjects) {
			if (go.id == gameObjectID) {
				return go;
			}
		}
		return null;
	}

	getGameObjectsLength(): number {
		return this.gameObjects.length;
	}

	update() {
		for (let go of this.gameObjects) {
			if (go.delete) {
				this.gameObjects.splice(this.gameObjects.indexOf(go), 1);
				this.gameObjectPool.push(go);
				//console.log(`Game Object ID ${go.id} deleted`);
			} else {
				if (go.isActive) {
					if (go.started == false) {
						go.start();
						go.started = true;
					}
					go.update();
				}
			}
		}
	}
}
