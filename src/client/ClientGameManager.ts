import { ClientHeartBeat_Packet } from './../shared/network/ClientHeartBeat';
import { NetworkID } from './../server/NetworkID';
import { InputAction } from './../shared/InputAction';
import { ClientInput_Data } from './../shared/network/ClientInput_Data';
import { ClientInput_Packet } from './../shared/network/ClientInput_Packet';
import { Player } from './../shared/Player';
import { CanvasCreator } from './CanvasCreator';
import { MovementScript } from './../shared/MovementScript';
import { GameManager } from '../shared/GameManager';
import { GameObject } from '../shared/GameObject';
import { Scene } from '../shared/Scene';
import { Transform } from '../shared/Transform';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { Input } from './Input';
import { SpriteRenderer } from './SpriteRenderer';
import { NetworkPacket } from '../shared/network/NetworkPacket';
import { ServerInfo_Data } from '../shared/network/ServerInfo_Data';
import { AssignPlayerID_Data } from '../shared/network/AssignPlayerID_Data';
import { Time } from './Time';
import { AddPlayerEvent_Data } from '../shared/network/AddPlayerEvent_Data';
import { UpdatePlayerPositions_Data } from '../shared/network/UpdatePlayerPositions_Data';
import { ClientHeartBeat_Data } from '../shared/network/ClientHeartBeat_Data';
import { RemovePlayerEvent_Data } from '../shared/network/RemovePlayerEvent_Data';

export class ClientGameManager extends GameManager {
	backgroundColor: string = 'cornflowerblue';

	camera: GameObject = new GameObject('Camera');

	players: Player[] = [];

	networkID: NetworkID = 0;

	ws: WebSocket;

	serverTickRate: number = 0;
	currentServerTick: number = 0;

	incomingPacketQueue: NetworkPacket[] = [];
	outgoingPacketQueue: NetworkPacket[] = [];

	incomingPacketCount = 0;
	outgoingPacketCount = 0;

	constructor() {
		super();
		this.gameName = 'Project Alpha';
		this.ws = new WebSocket('ws://joshh.moe:8080');
		this.initializeSockets(this.ws);
	}

	initializeSockets(ws: WebSocket) {
		ws.onopen = () => {
			console.warn('Connected to Server');
		};
		ws.onmessage = msg => {
			var data: NetworkPacket[] = JSON.parse(msg.data) as NetworkPacket[];
			for (var p of data) {
				this.incomingPacketQueue.push(p);
			}
		};
	}

	start() {
		this.createScene(new Scene(), this.objectManager);
		{
			let temp = new GameObject('Middle of World');
			temp.addComponent(new Transform());
			let sR = new SpriteRenderer();
			sR.setImage('Jesus', 1000, 1000);
			sR.origin = new Vector2(0.5, 0.5);
			sR.debug = true;
			temp.addComponent(sR);
			this.objectManager.addGameObject(temp);
		}

		let cam = new Camera();
		this.camera.addComponent(cam);
		this.objectManager.addGameObject(this.camera);
	}

	update() {
		if (this.incomingPacketQueue.length > 0) {
			this.incomingPacketCount = 0;
		}
		this.outgoingPacketCount = 0;

		var camera = this.camera.getComponent('Camera') as Camera;
		camera.input(Input.GetInputs());

		for (var p of this.players) {
			if (p.inputScript) {
				p.inputScript.called = false;
			}
		}

		for (var packet of this.incomingPacketQueue) {
			this.incomingPacketCount++;
			switch (packet.type) {
				case 'ServerInfo':
					let serverInfoData = packet.data as ServerInfo_Data;
					//console.warn('Server Info', serverInfoData);
					this.serverTickRate = serverInfoData.tickrate;
					this.currentServerTick = serverInfoData.tick;
					break;
				case 'AssignPlayerID':
					let assignPlayerIDData = packet.data as AssignPlayerID_Data;
					//console.warn('Assign Player ID', assignPlayerIDData.networkID);
					this.networkID = assignPlayerIDData.networkID;
					break;
				case 'UpdatePlayerPositions':
					let playerPosData = packet.data as UpdatePlayerPositions_Data;
					for (var o of playerPosData.players) {
						for (var p of this.players) {
							if (this.networkID == o[0]) {
								var cam = this.camera.getComponent('Camera') as Camera;
								if (p.inputScript) cam.target = p.inputScript.transform;
							}
							if (p.networkId == o[0]) {
								if (p.inputScript?.transform?.position) {
									p.inputScript.transform.position = Vector2.copy(o[1]);
								}
								break;
							}
						}
					}
					break;
				case 'AddPlayerEvent':
					let addPlayerEventData = packet.data as AddPlayerEvent_Data;
					var flag = false;
					for (var p of this.players) {
						if (p.networkId == addPlayerEventData.networkID) {
							flag = true;
							break;
						}
					}

					if (!flag) {
						var go = new GameObject(`Player ${addPlayerEventData.networkID}`);
						var t = new Transform(
							new Vector2(
								addPlayerEventData.position.x,
								addPlayerEventData.position.y
							)
						);
						go.addComponent(t);

						let sR = new SpriteRenderer();
						sR.setImage('TrollFace', 50, 50);
						//sR.debug = true;
						sR.origin = new Vector2(0.5, 0.5);
						go.addComponent(sR);

						var inputScript = new MovementScript();
						go.addComponent(inputScript);

						var player = new Player();
						player.networkId = addPlayerEventData.networkID;
						player.inputScript = inputScript;
						this.players.push(player);

						this.objectManager.addGameObject(go);
					}

					break;
				case 'RemovePlayerEvent':
					var removePlayer = packet.data as RemovePlayerEvent_Data;
					console.log('Remove Player');
					for (var p of this.players) {
						if (p.networkId == removePlayer.networkID) {
							this.objectManager.removeGameObject(
								`Player ${removePlayer.networkID}`
							);
							this.players.splice(this.players.indexOf(p), 1);
						}
					}
					break;
			}
		}
		this.incomingPacketQueue.length = 0;

		this.objectManager.update();
		SpriteRenderer.drawCount = 0;
		this.objectManager.render();

		if (Input.GetInputs().length != 0) {
			this.outgoingPacketQueue.push(
				new ClientInput_Packet(
					new ClientInput_Data(Input.GetInputs(), this.networkID)
				)
			);
		}

		this.outgoingPacketQueue.push(
			new ClientHeartBeat_Packet(new ClientHeartBeat_Data(this.networkID))
		);
		this.outgoingPacketCount = this.outgoingPacketQueue.length;
		if (this.ws.readyState == 1) {
			this.ws.send(JSON.stringify(this.outgoingPacketQueue));
			this.outgoingPacketQueue.length = 0;
		}
	}

	onDebug() {
		this.objectManager.onDebug();
		var ctx = CanvasCreator.context;
		ctx!.fillStyle = 'rgba(0,0,0,0.5)';
		ctx!.fillRect(window.innerWidth - 265, 0, 265, 105 + 15);
		ctx!.fillStyle = 'white';
		ctx!.font = '15px Consolas';
		ctx!.fillText(`"${this.gameName}" Debug`, window.innerWidth - 265 + 10, 15);
		ctx!.fillText(
			`NetworkID: ${this.networkID}`,
			window.innerWidth - 265 + 10,
			30
		);
		ctx!.fillText(
			`Server Tick Rate: ${this.serverTickRate}`,
			window.innerWidth - 265 + 10,
			45
		);
		ctx!.fillText(
			`Server Tick: ${this.currentServerTick}`,
			window.innerWidth - 265 + 10,
			60
		);
		ctx!.fillText(
			`Outgoing Packets: ${this.outgoingPacketCount}`,
			window.innerWidth - 265 + 10,
			60 + 15
		);
		ctx!.fillText(
			`Incoming Packets: ${this.incomingPacketCount}`,
			window.innerWidth - 265 + 10,
			60 + 30
		);
	}
}
