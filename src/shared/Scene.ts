import { GameObject } from './GameObject';
import { Transform } from './Transform';

export class Scene {
	sceneName: string;

	//TODO: static/global object pooling
	private gameObjects: GameObject[] = [];
	private static filledPool: boolean = false;
	private static gameObjectPool: GameObject[] = [];
	private initialPoolSize: number = 500;
	constructor(sceneName: string) {
		this.sceneName = sceneName;
		if (!Scene.filledPool) {
			for (var i = 0; i < this.initialPoolSize; i++) {
				Scene.gameObjectPool.push(new GameObject());
			}
			Scene.filledPool = true;
		}
	}

	static getPoolSize(): number {
		return Scene.gameObjectPool.length;
	}

	static createGameObject(gameObjectName: string): GameObject {
		var go = Scene.gameObjectPool.shift();
		if (!go) {
			go = new GameObject();
		}

		//Resets Game Object to defaults;
		go.scene = null;
		go.id = GameObject.lastID++;
		go.components.length = 0;
		go.children.length = 0;
		go.transform = new Transform();
		go.name = gameObjectName;

		return go;
	}

	addGameObject(go: GameObject) {
		go.scene = this;
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

	getGameObjects() {
		return this.gameObjects;
	}

	update() {
		for (let go of this.gameObjects) {
			if (go.delete) {
				this.gameObjects.splice(this.gameObjects.indexOf(go), 1);
				Scene.gameObjectPool.push(go);
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
		for (let go of this.gameObjects) {
			go.lateUpdate();
		}
	}
}
