import { FrameRate } from './../client/FrameRate';
import { GameObjectManager } from './GameObjectManager';
export abstract class Game {
	gameObjectManager: GameObjectManager = new GameObjectManager();

	// prettier-ignore
	abstract gameName: string;
	// prettier-ignore
	abstract frameRate: FrameRate | number;
	frame: number = 0;

	abstract setupScene(): void;
	abstract start(): void;
	abstract update(): void;
}
