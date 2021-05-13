import { GameComponent } from './../shared/GameComponent';
import { ClientManager } from './ClientManager';
import { GameObjectManager } from '../shared/GameObjectManager';
import WebSocket from 'ws';
import { Time } from '../server/Time';
import { WorldState } from '../shared/network/WorldState';
import { WorldStateData } from '../shared/network/WorldStateData';
import { NetworkPacket } from '../shared/network/NetworkPacket';
import { GameObject } from '../shared/GameObject';
import { Transform } from '../shared/Transform';

export class Server {
	tickRate: number;
	tick: number = 0;
	lastTime: number = 0;
	objectManager: GameObjectManager = new GameObjectManager();
	wss: WebSocket.Server;
	constructor(wss: WebSocket.Server, tickrate?: number) {
		this.tickRate = tickrate || 20;

		// SOCKET START
		{
			this.wss = wss;
			wss.on('connection', (ws, req) => {
				console.log('A Client Connected');
				ws.onmessage = msg => {
					console.log(msg.data);
				};
				var data: NetworkPacket[] = [];
				var goList: GameObject[] = [];
				for (var go of this.objectManager.gameObjects) {
					if (go.isNetworked) {
						var tempGo = new GameObject();
						var coList: GameComponent[] = [];
						for (var co of go.getComponents()) {
							if (go.isNetworked) {
								coList.push(co);
							}
						}
						//handle netProps
						tempGo.components = coList;
						goList.push(tempGo);
					}
				}
				var worldState = new WorldState(
					new WorldStateData(this.tickRate, this.tick, goList)
				);
				data.push(worldState);
				ws.send(
					JSON.stringify(data, (key: any, value: any) => {
						//removes parent property to prevent circular referencing
						if (key == 'isNetworked') {
							return undefined;
						}
						if (key == 'parent') return undefined;
						else return value;
					})
				);
				//TODO: Handle disconnect
			});
		}
		// SOCKET END

		console.log('Server Created with tickrate of', this.tickRate);
	}
	start() {
		{
			var go = new GameObject();
			go.addComponent(new ClientManager());
			go.isNetworked = false;
			this.objectManager.addGameObject(go);
		}
		{
			var go = new GameObject();
			var trans = new Transform();
			go.addComponent(trans);
			this.objectManager.addGameObject(go);
		}
		console.log('Server Started');
		this.lastTime = Time.getCurrTime();
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
		//start actual loop
		this.tick++;
		Time.deltaTime = (currTime - this.lastTime) / 1000;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.frameTimeList.push(Time.deltaTime);

		//Update
		this.objectManager.update();
		//
		if (this.tick % (this.tickRate * 5) == 0) {
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
				this.objectManager.getObjectListSize(),
				'objects.'
			);
			this.frameTimeList.length = 0;
		}

		let temp: any = {};
		temp.type = 'Server Tick';
		temp.tick = this.tick;
		setImmediate(this.loop.bind(this));
	}
}
