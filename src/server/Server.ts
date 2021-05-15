import { ServerGameManager } from './ServerGameManager';
import { Time } from '../server/Time';

export class Server {
	game: ServerGameManager = new ServerGameManager();
	lastTime: number = 0;
	constructor() {
		console.log('Server Created with tickrate of', this.game.tickRate);
	}
	start() {
		console.log('Server Started');
		this.lastTime = Time.getCurrTime();
		this.game.start();
		this.loop();
	}

	private frameTimeList: number[] = [];
	private setIntervalError: number = 3; //Error in milliseconds that setInterval causes for proper consistent frametimes
	loop() {
		let currTime = Time.getCurrTime();
		let self = this;
		//check if ready for next loop
		let tickDelta = 1 / this.game.tickRate;
		if (currTime - this.lastTime < tickDelta) {
			if (currTime - this.lastTime + this.setIntervalError < tickDelta) {
				setTimeout(self.loop.bind(this), 1);
			} else {
				setImmediate(self.loop.bind(this));
			}
			return;
		}
		this.game.tick++;
		Time.deltaTime = currTime - this.lastTime;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.frameTimeList.push(Time.deltaTime);

		this.game.update();

		//
		if (this.game.tick % (this.game.tickRate * 15) == 0) {
			let b = 0;
			for (let a of this.frameTimeList) {
				b += a;
			}
			console.log(
				'Tick',
				this.game.tick,
				'| Tick Rate:',
				parseFloat((1 / (b / this.frameTimeList.length)).toFixed(1)),
				'|',
				parseFloat(Time.elapsedTime.toFixed(1)),
				'seconds |',
				this.game.objectManager.getObjectListSize(),
				'objects | Connections: ',
				this.game.players.length
			);
			this.frameTimeList.length = 0;
		}
		setImmediate(this.loop.bind(this));
	}
}
