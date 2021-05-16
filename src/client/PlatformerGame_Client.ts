import { PlatformerCameraController } from './PlatformerCameraController';
import { ButtonRenderer } from './ButtonRenderer';
import { SpriteLayer } from './SpriteLayer';
import { SpriteManager } from './SpriteManager';
import { FrameRate } from './FrameRate';
import { MovementScript } from './../shared/MovementScript';
import { SpriteRenderer } from './SpriteRenderer';
import { Camera } from './Camera';
import { Game } from '../shared/Game';
import { AssetManager } from './AssetManager';
import { Sprite } from './Sprite';
import { Vector2 } from '../shared/Vector2';
import { Scene } from '../shared/Scene';

export class PlatformerGame_Client extends Game {
	frameRate = FrameRate.DYNAMIC_FRAMERATE;
	gameName = 'Platformer Game';

	constructor() {
		super();
		this.loadAssets();
	}

	loadAssets() {
		AssetManager.loadImage('trollface.png', 'TrollFace');
		AssetManager.loadImage('roadmap.png', 'Background');
	}

	setupScenes() {
		{
			var gameScene = new Scene('Game');
			var background = Scene.createGameObject('Background');
			var bgImage = AssetManager.getImage('Background');
			var sr = new SpriteRenderer();
			sr.setSprite(
				new Sprite(bgImage, SpriteLayer.BACKGROUND, new Vector2(0.5, 0.5), 0.5)
			);
			background.addComponent(sr);
			gameScene.addGameObject(background);

			{
				var player = Scene.createGameObject('Player');
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
				gameScene.addGameObject(player);
				let camera = Scene.createGameObject('Camera');
				let cam = new Camera();
				cam.controller = new PlatformerCameraController();
				camera.addComponent(cam);
				gameScene.addGameObject(camera);
			}
			this.addScene(gameScene);
		}
		{
			var mainMenu = new Scene('Main Menu');

			//make cam
			let camera = Scene.createGameObject('Camera');
			let cam = new Camera();
			//c.controller = new PlatformerCameraController();
			camera.addComponent(cam);
			mainMenu.addGameObject(camera);

			//make button
			var button = Scene.createGameObject('Button');
			var bRenderer = new ButtonRenderer();
			bRenderer.text = 'Start Game';
			bRenderer.textSize = 15;
			bRenderer.width = 240;

			button.addComponent(bRenderer);
			mainMenu.addGameObject(button);

			this.addScene(mainMenu);
		}
		this.setScene('Main Menu');
	}
	start() {}

	update() {
		SpriteRenderer.drawCount = 0;
		SpriteManager.sprites.length = 0;
		if (this.currentScene) {
			this.currentScene.update();
		}
		SpriteManager.render();
	}
}
