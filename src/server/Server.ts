import { Time } from '../shared/Time';
import { Game } from '../shared/Game';

export class Server {
	game: Game;
	lastTime: number = 0;
	constructor(game: Game) {
		this.game = game;
	}
	start() {
		console.log('Server Started');

		this.lastTime = Time.getCurrTime();
		this.game.setup();
		this.game.start();

		this.loop();
	}

	private frameTimeList: number[] = [];
	private setTimeoutError: number = 2; //Error in milliseconds that setInterval causes for proper consistent frametimes
	loop() {
		let self = this;
		let currTime = Time.getCurrTime();

		let tickDelta = 1 / this.game.frameRate;
		if (currTime - this.lastTime < tickDelta) {
			if (currTime - this.lastTime + this.setTimeoutError / 1000 < tickDelta) {
				setTimeout(
					self.loop.bind(this),
					1000 / this.game.frameRate -
						((currTime - this.lastTime) * 1000 + this.setTimeoutError)
				);
			} else {
				setImmediate(self.loop.bind(this));
			}
			return;
		}

		Time.deltaTime = currTime - this.lastTime;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.frameTimeList.push(Time.deltaTime);

		this.game.frame++;
		this.game.update();

		if (this.game.frame % (this.game.frameRate * 60) == 0) {
			let b = 0;
			for (let a of this.frameTimeList) {
				b += a;
			}
			console.log(
				'Frame',
				this.game.frame,
				'| Frame Rate:',
				parseFloat((1 / (b / this.frameTimeList.length)).toFixed(2)),
				'|',
				parseFloat(Time.elapsedTime.toFixed(0)),
				'seconds |',
				this.game.currentScene!.getGameObjectsLength(),
				'objects'
			);
			this.frameTimeList.length = 0;
		}
		setImmediate(this.loop.bind(this));
	}
}
