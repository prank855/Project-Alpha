import { ServerGameManager } from './ServerGameManager';
import { ConnectedClientManager } from './ConnectedClientManager';
import WebSocket from 'ws';
import { Time } from '../server/Time';

export class Server {
	game: ServerGameManager = new ServerGameManager();
	tickRate: number;
	tick: number = 0;
	lastTime: number = 0;
	wss: WebSocket.Server;
	connectedClientManager = new ConnectedClientManager();
	constructor(wss: WebSocket.Server, tickrate?: number) {
		this.tickRate = tickrate || 20;
		this.wss = wss;
		// SOCKET START
		{
			wss.on('connection', (ws, req) => {
				var id = this.connectedClientManager.addClient(ws);
				console.log(`Created Client with ID ${id}`);
				ws.onmessage = msg => {
					var temp = JSON.parse(msg.data.toString());
					this.connectedClientManager.addIncomingPacket(temp);
				};

				//TODO: Handle disconnect
			});
		}
		// SOCKET END

		console.log('Server Created with tickrate of', this.tickRate);
	}
	start() {
		console.log('Server Started');
		this.lastTime = Time.getCurrTime();
		this.game.start();
		this.loop();
	}

	private frameTimeList: number[] = [];
	private setIntervalError: number = 2; //Error in milliseconds that setInterval causes for proper consistent frametimes
	loop() {
		let currTime = Time.getCurrTime();
		let self = this;
		//check if ready for next loop
		let tickDelta = 1000 / this.tickRate;
		if (currTime - this.lastTime < tickDelta) {
			if (currTime - this.lastTime + this.setIntervalError < tickDelta) {
				setTimeout(self.loop.bind(this), 1);
			} else {
				setImmediate(self.loop.bind(this));
			}
			return;
		}
		this.tick++;
		Time.deltaTime = (currTime - this.lastTime) / 1000;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.frameTimeList.push(Time.deltaTime);

		this.game.update();

		//
		if (this.tick % (this.tickRate * 15) == 0) {
			let b = 0;
			for (let a of this.frameTimeList) {
				b += a;
			}
			console.log(
				'Tick',
				this.tick,
				'| Tick Rate:',
				(1 / (b / this.frameTimeList.length)).toFixed(2),
				'|',
				Time.elapsedTime.toFixed(2),
				'seconds |',
				this.game.objectManager.getObjectListSize(),
				'objects | Packets:',
				this.connectedClientManager.getPacketQueueLength()
			);
			this.frameTimeList.length = 0;
		}

		let temp: any = {};
		temp.type = 'Server Tick';
		temp.tick = this.tick;
		setImmediate(this.loop.bind(this));
	}
}
