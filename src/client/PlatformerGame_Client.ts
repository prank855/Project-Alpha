import { SpriteLayer } from './SpriteLayer';
import { SpriteManager } from './SpriteManager';
import { FrameRate } from './FrameRate';
import { MovementScript } from './../shared/MovementScript';
import { SpriteRenderer } from './SpriteRenderer';
import { Camera } from './Camera';
import { NetworkedGameClient } from '../shared/network/NetworkedGameClient';
import { Game } from '../shared/Game';
import { AssetManager } from './AssetManager';
import { Sprite } from './Sprite';
import { Vector2 } from '../shared/Vector2';

export class PlatformerGame_Client extends Game implements NetworkedGameClient {
	frameRate = FrameRate.SMOOTH_FRAMERATE;
	gameName = 'Platformer Game';

	websocket = new WebSocket('ws://joshh.moe:8080');
	incomingPacketQueue = [];
	outgoingPacketQueue = [];

	camera = new Camera();

	constructor() {
		super();
		this.initializeWebSocket();
		this.loadAssets();
	}

	initializeWebSocket() {
		this.websocket.onopen = () => {
			console.warn(`Connected to ${this.websocket.url}`);
		};
		this.websocket.onmessage = msg => {
			console.log(msg.data);
		};
	}

	loadAssets() {
		AssetManager.loadImage('trollface.png', 'TrollFace');
		AssetManager.loadImage('roadmap.png', 'Background');
	}

	setupScene() {
		var background = this.gameObjectManager.createGameObject('Background');
		var bgImage = AssetManager.getImage('Background');
		var sr = new SpriteRenderer();
		sr.setSprite(
			new Sprite(bgImage, SpriteLayer.BACKGROUND, new Vector2(0.5, 0.5), 0.5)
		);
		background.addComponent(sr);
		this.gameObjectManager.addGameObject(background);

		{
			var player = this.gameObjectManager.createGameObject('Player');
			player.transform.position = new Vector2(
				Math.random() * 400,
				Math.random() * 400
			);
			var image = AssetManager.getImage('TrollFace');
			var b = new SpriteRenderer();
			b.setSprite(
				new Sprite(image, SpriteLayer.FOREGROUND, new Vector2(0.5, 0.5), 0.1)
			);
			player.addComponent(b);
			player.addComponent(new MovementScript());
			this.gameObjectManager.addGameObject(player);
			Camera.position = Vector2.copy(player.transform.position);
			this.camera.target = player;
		}
	}
	start() {}

	update() {
		SpriteRenderer.drawCount = 0;
		SpriteManager.sprites.length = 0;
		this.camera.update();
		this.gameObjectManager.update();
		SpriteManager.render();
	}
}
