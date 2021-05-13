import { GameManager } from './../shared/GameManager';
export class ServerGameManager extends GameManager {
	constructor() {
		super();
	}
	start() {
		this.objectManager.update();
	}
}
