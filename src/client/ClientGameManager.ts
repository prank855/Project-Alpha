import { MovementScript } from './../shared/MovementScript';
import { GameManager } from '../shared/GameManager';
import { GameObject } from '../shared/GameObject';
import { Scene } from '../shared/Scene';
import { Transform } from '../shared/Transform';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { Input } from './Input';
import { SpriteRenderer } from './SpriteRenderer';
import { ClientInputState } from '../shared/network/ClientInputState';
import { ClientInputStateData } from '../shared/network/ClientInputStateData';
import { NetworkPacket } from '../shared/network/NetworkPacket';

export class ClientGameManager extends GameManager {
	player: GameObject = new GameObject('Player');

	camera: GameObject = new GameObject('Camera');

	otherPlayers: GameObject[] = [];

	ws: WebSocket = new WebSocket('ws://joshh.moe:8080');

	constructor() {
		super();
		this.gameName = 'Project Alpha';
	}

	start() {
		this.ws.onopen = () => {
			console.log('Connected to Server');
			var data = new ClientInputState(
				new ClientInputStateData(Input.GetInputs())
			);
			this.ws.send(JSON.stringify(data));
		};
		this.ws.onmessage = e => {
			var data: NetworkPacket[] = JSON.parse(e.data);
			console.log('Received Data', data);
			for (var p of data) {
				//this.serverManager.addIncomingPacket(p);
			}
		};

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

		this.player.addComponent(
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
		this.player.addComponent(sR);
		let movementScript = new MovementScript();
		movementScript.debug = true;
		this.player.addComponent(movementScript);
		this.objectManager.addGameObject(this.player);

		let cam = new Camera();
		cam.target = this.player.getComponent('Transform') as Transform;
		this.camera.addComponent(cam);
		this.objectManager.addGameObject(this.camera);
	}

	update() {
		var movementScript: MovementScript = this.player.getComponent(
			'MovementScript'
		) as MovementScript;
		movementScript.input(Input.GetInputs());

		var camera = this.camera.getComponent('Camera') as Camera;
		camera.input(Input.GetInputs());

		this.objectManager.update();
		SpriteRenderer.drawCount = 0;
		this.objectManager.render();
	}

	onDebug() {
		this.objectManager.onDebug();
	}
}
