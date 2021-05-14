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

export class ClientGameManager extends GameManager {
	backgroundColor: string = 'cornflowerblue';

	player = new Player();

	camera: GameObject = new GameObject('Camera');

	otherPlayers: Player[] = [];

	ws: WebSocket;

	serverTickRate: number = 0;
	currentServerTick: number = 0;

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
		ws.onmessage = e => {
			var data: NetworkPacket[] = JSON.parse(e.data) as NetworkPacket[];
			//console.warn('Raw Packet Data', data);
			for (var packet of data) {
				switch (packet.type) {
					case 'ServerInfo':
						let serverInfoData = packet.data as ServerInfo_Data;
						console.warn('Server Info', serverInfoData);
						this.serverTickRate = serverInfoData.tickrate;
						this.currentServerTick = serverInfoData.tick;
						break;
					case 'AssignPlayerID':
						let assignPlayerIDData = packet.data as AssignPlayerID_Data;
						console.warn('Assign Player ID', assignPlayerIDData.networkID);
						this.player.networkId = assignPlayerIDData.networkID;
						break;
				}
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

		var playerObj = new GameObject('Player');
		playerObj.addComponent(
			new Transform(
				new Vector2(
					(Math.random() * window.innerWidth) / 2 - window.innerWidth / 4,
					(Math.random() * window.innerHeight) / 2 - window.innerHeight / 4
				)
			)
		);
		let sR = new SpriteRenderer();
		sR.setImage('TrollFace', 50, 50);
		sR.debug = true;
		sR.origin = new Vector2(0.5, 0.5);
		playerObj.addComponent(sR);
		let movementScript = new MovementScript();
		movementScript.debug = true;
		playerObj.addComponent(movementScript);
		this.objectManager.addGameObject(playerObj);
		this.player.inputScript = movementScript;

		let cam = new Camera();
		cam.target = playerObj.getComponent('Transform') as Transform;
		this.camera.addComponent(cam);
		this.objectManager.addGameObject(this.camera);
	}

	update() {
		if (this.player.inputScript)
			this.player.inputScript.input(Input.GetInputs());

		var camera = this.camera.getComponent('Camera') as Camera;
		camera.input(Input.GetInputs());

		this.player.clearPackets();

		this.objectManager.update();
		SpriteRenderer.drawCount = 0;
		this.objectManager.render();
		if (Input.GetInputs().length != 0) {
			this.player.addPacket(
				new ClientInput_Packet(new ClientInput_Data(Input.GetInputs()))
			);
		}
		this.player.sendPackets(this.ws);
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
			`NetworkID: ${this.player.networkId}`,
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
			`Outgoing Packets: ${this.player.getPacketAmount()}`,
			window.innerWidth - 265 + 10,
			60 + 15
		);
	}
}
