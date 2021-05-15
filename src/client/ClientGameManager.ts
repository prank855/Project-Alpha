import { ClientHeartBeat_Packet } from './../shared/network/ClientHeartBeat';
import { NetworkID } from './../server/NetworkID';
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
import { AddPlayerEvent_Data } from '../shared/network/AddPlayerEvent_Data';
import { UpdatePlayerPositions_Data } from '../shared/network/UpdatePlayerPositions_Data';
import { ClientHeartBeat_Data } from '../shared/network/ClientHeartBeat_Data';
import { RemovePlayerEvent_Data } from '../shared/network/RemovePlayerEvent_Data';
import { Time } from '../shared/Time';

export class ClientGameManager extends GameManager {
	backgroundColor: string = 'cornflowerblue';

	camera: Camera = new Camera();

	player: Player | null = null;
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
		ws.onclose = () => {
			location.reload();
		};
	}

	start() {
		this.createScene(new Scene(), this.objectManager);
		{
			let temp = new GameObject('Middle of World');
			temp.addComponent(new Transform());
			let sR = new SpriteRenderer();
			sR.setImage('Jesus', 0.5);
			sR.origin = new Vector2(0.5, 0.5);
			//sR.debug = true;
			temp.addComponent(sR);
			this.objectManager.addGameObject(temp);
		}

		//Create Camera
		{
			let camGo = new GameObject('Camera');
			camGo.addComponent(this.camera);
			this.objectManager.addGameObject(camGo);
		}

		this.lastSend = Time.elapsedTime;
	}

	lastSend = 0;
	serverDeltaTimes: number[] = [];

	update() {
		if (this.incomingPacketQueue.length > 0) {
			this.incomingPacketCount = 0;
		}

		this.camera.input(Input.GetInputs());

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
					if (
						serverInfoData.tick > this.currentServerTick + 1 ||
						serverInfoData.tick < this.currentServerTick
					) {
						if (this.currentServerTick != 0)
							console.warn('Packet Loss/Skipped');
					}
					this.serverTickRate = 1 / serverInfoData.deltaTime;
					this.currentServerTick = serverInfoData.tick;
					this.serverDeltaTimes.push(serverInfoData.deltaTime);
					break;
				case 'AssignPlayerID':
					let assignPlayerIDData = packet.data as AssignPlayerID_Data;
					//console.warn('Assign Player ID', assignPlayerIDData.networkID);
					this.networkID = assignPlayerIDData.networkID;
					break;
				case 'UpdatePlayerPositions':
					let playerPosData = packet.data as UpdatePlayerPositions_Data;
					//TODO: handle self player desync from server

					for (var o of playerPosData.players) {
						for (var p of this.players) {
							if (p.networkId == o[0]) {
								if (this.networkID != o[0]) {
									if (p.inputScript?.transform?.position) {
										p.inputScript.transform.position = Vector2.copy(o[1]);
									}
									break;
								} else {
									// basic rubberbanding
									if (
										Input.GetInputs().length == 0 &&
										p.inputScript?.transform?.position &&
										Vector2.Distance(o[1], p.inputScript.transform.position) >
											10
									) {
										p.inputScript.transform.position = Vector2.copy(o[1]);
									}
								}
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
						sR.setImage('TrollFace', 0.12);
						//sR.debug = true;
						sR.origin = new Vector2(0.5, 0.5);
						go.addComponent(sR);

						var inputScript = new MovementScript();
						go.addComponent(inputScript);

						var player = new Player();
						player.networkId = addPlayerEventData.networkID;
						player.inputScript = inputScript;
						if (this.networkID == addPlayerEventData.networkID) {
							inputScript.debug = true;
							this.player = player;
						}
						this.players.push(player);

						this.objectManager.addGameObject(go);
					}

					break;
				case 'RemovePlayerEvent':
					var removePlayer = packet.data as RemovePlayerEvent_Data;
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

		this.outgoingPacketQueue.push(
			new ClientHeartBeat_Packet(new ClientHeartBeat_Data(this.networkID))
		);
		if (this.ws.readyState != 1) {
			this.outgoingPacketQueue.length = 0;
		}
		for (var deltaTime of this.serverDeltaTimes) {
			var inputs = Input.GetInputs();
			if (this.player) {
				this.player.inputScript?.input(deltaTime, inputs);
				this.camera.target = this.player.inputScript!.transform;
			}
			if (inputs.length != 0) {
				this.outgoingPacketQueue.push(
					new ClientInput_Packet(
						new ClientInput_Data(inputs, this.networkID, deltaTime)
					)
				);
			}

			if (this.ws.readyState == 1) {
				this.ws.send(JSON.stringify(this.outgoingPacketQueue));
				this.outgoingPacketCount = this.outgoingPacketQueue.length;
				this.outgoingPacketQueue.length = 0;
			}
		}
		this.serverDeltaTimes.length = 0;
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
			`Server Tick Rate: ${this.serverTickRate.toFixed(2)}`,
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
