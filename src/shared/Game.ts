import { FrameRate } from './../client/FrameRate';
import { Scene } from './Scene';
export abstract class Game {
	static singleton: Game;
	scenes: Scene[] = [];
	currentScene: Scene = new Scene('EMPTY SCENE');

	constructor() {
		if (!Game.singleton) {
			Game.singleton = this;
		} else {
			throw 'You can not have more than one instance of Game';
		}
		this.scenes.push(this.currentScene);
	}

	// prettier-ignore
	abstract gameName: string;
	// prettier-ignore
	abstract frameRate: FrameRate | number;
	frame: number = 0;

	abstract setup(): void;
	abstract start(): void;
	abstract update(): void;
	addScene(scene: Scene): void {
		this.scenes.push(scene);
	}
	setScene(sceneName: string): void {
		for (var s of this.scenes) {
			if (s.sceneName == sceneName) {
				this.currentScene = s;
				return;
			}
		}
	}
}
