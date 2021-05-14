import { UpdatePlayerPositions_Data } from './../shared/network/UpdatePlayerPositions_Data';
import { UpdatePlayerPositions_Packet } from './../shared/network/UpdatePlayerPositions_Packet';
import { Vector2 } from './../shared/Vector2';
import { NetworkID } from './NetworkID';
import { AddPlayerEvent_Data } from './../shared/network/AddPlayerEvent_Data';
import { AddPlayerEvent_Packet } from './../shared/network/AddPlayerEvent_Packet';
import { ClientInput_Data } from './../shared/network/ClientInput_Data';
import { MovementScript } from './../shared/MovementScript';
import { Transform } from './../shared/Transform';
import { GameObject } from './../shared/GameObject';
import { Player } from './../shared/Player';
import { GameManager } from './../shared/GameManager';
import WebSocket from 'ws';
import { AssignPlayerID_Data } from '../shared/network/AssignPlayerID_Data';
import { AssignPlayerID_Packet } from '../shared/network/AssignPlayerID_Packet';
import { NetworkPacket } from '../shared/network/NetworkPacket';
import { ServerInfo_Data } from '../shared/network/ServerInfo_Data';
import { ServerInfo_Packet } from '../shared/network/ServerInfo_Packet';
import { Time } from './Time';
export class ServerGameManager extends GameManager {
	wss: WebSocket.Server;

	tickRate: number = 128;
	tick: number = 0;

	players: [Player, WebSocket][] = [];

	incomingPacketQueue: NetworkPacket[] = [];
	outgoingPacketQueue: NetworkPacket[] = [];

	constructor() {
		super();
		this.wss = new WebSocket.Server({ port: 8080 });
		this.initializeSockets(this.wss);
	}
	initializeSockets(wss: WebSocket.Server) {
		wss.on('connection', (ws, req) => {
			var data: NetworkPacket[] = [];
			const crypto = require('crypto');
			var id = crypto.randomInt(0, 10000000);
			var player = new Player();

			this.players.push([player, ws]);
			var go = new GameObject(`Player ${id}`);
			var t = new Transform();
			go.addComponent(t);
			var playerScript = new MovementScript();
			go.addComponent(playerScript);
			player.inputScript = playerScript;
			player.networkId = id;
			this.objectManager.addGameObject(go);
			for (var p of this.players) {
				if (p[0].inputScript?.transform) {
					this.outgoingPacketQueue.push(
						new AddPlayerEvent_Packet(
							new AddPlayerEvent_Data(
								p[0].networkId,
								p[0].inputScript.transform.position
							)
						)
					);
				}
			}
			this.outgoingPacketQueue.push(
				new AddPlayerEvent_Packet(new AddPlayerEvent_Data(id, t.position))
			);
			data.push(
				new ServerInfo_Packet(
					new ServerInfo_Data(this.tickRate, this.tick, Time.elapsedTime)
				)
			);
			data.push(new AssignPlayerID_Packet(new AssignPlayerID_Data(id)));
			ws.send(JSON.stringify(data));
			console.log(`Created Client with ID:`, id);
			ws.onmessage = msg => {
				var data: NetworkPacket[] = JSON.parse(
					msg.data.toString()
				) as NetworkPacket[];
				//console.warn('Raw Packet Data', data);
				for (var p of data) {
					this.incomingPacketQueue.push(p);
				}
			};
		});
	}
	start() {}
	update() {
		for (var packet of this.incomingPacketQueue) {
			switch (packet.type) {
				case 'ClientInput':
					let clientInputData = packet.data as ClientInput_Data;
					for (var p of this.players) {
						if (p[0].networkId == clientInputData.networkID) {
							p[0].inputScript?.input(Time.deltaTime, clientInputData.inputs);
						}
					}
					break;
			}
		}
		for (var p of this.players) {
			if (!p[0].inputScript?.called) {
				p[0].inputScript?.input(Time.deltaTime);
			}
		}
		this.incomingPacketQueue.length = 0;
		this.objectManager.update();
		this.outgoingPacketQueue.push(
			new ServerInfo_Packet(
				new ServerInfo_Data(this.tickRate, this.tick, Time.elapsedTime)
			)
		);

		var playerPositions: [NetworkID, Vector2][] = [];

		for (var p of this.players) {
			if (p[0].inputScript?.transform?.position) {
				playerPositions.push([
					p[0].networkId,
					Vector2.copy(p[0].inputScript.transform.position)
				]);
			}
		}

		this.outgoingPacketQueue.push(
			new UpdatePlayerPositions_Packet(
				new UpdatePlayerPositions_Data(playerPositions)
			)
		);

		if (this.outgoingPacketQueue.length != 0) {
			for (var p of this.players) {
				p[1].send(JSON.stringify(this.outgoingPacketQueue));
			}
			this.outgoingPacketQueue.length = 0;
		}
	}
}
