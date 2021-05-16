import { GuiBox } from './GuiBox';
import { PlatformerCameraController } from './PlatformerCameraController';
import { GuiButton } from './GuiButton';
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
import { CanvasCreator } from './CanvasCreator';
import { DynamicMenuMovement } from './DynamicMenuMovement';
import { CursorManager } from './CursorManager';

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
		AssetManager.loadImage('smiley.png', 'Smiley');
		AssetManager.loadImage('cursor.png', 'Cursor');
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
				var image = AssetManager.getImage('Smiley');
				var b = new SpriteRenderer();
				b.setSprite(
					new Sprite(
						image,
						SpriteLayer.FOREGROUND,
						new Vector2(0.5, 0.5),
						2,
						false
					)
				);
				player.addComponent(b);
				player.addComponent(new MovementScript());
				gameScene.addGameObject(player);
				let camera = Scene.createGameObject('Camera');
				let cam = new Camera();
				cam.controller = new PlatformerCameraController();
				cam.target = player;
				cam.position = Vector2.copy(player.transform.position);
				camera.addComponent(cam);
				var cursor = Scene.createGameObject('Cursor');
				cursor.addComponent(new CursorManager());
				let cursorSpriteRender = new SpriteRenderer();
				cursorSpriteRender.setSprite(
					new Sprite(
						AssetManager.getImage('Cursor'),
						SpriteLayer.GUI,
						new Vector2(0, 0),
						0.5,
						true,
						true
					)
				);
				cursor.addComponent(cursorSpriteRender);
				gameScene.addGameObject(cursor);
				gameScene.addGameObject(camera);
			}
			this.addScene(gameScene);
		}
		{
			var mainMenu = new Scene('Main Menu');

			var cursor = Scene.createGameObject('Cursor');
			cursor.addComponent(new CursorManager());
			let cursorSpriteRender = new SpriteRenderer();
			cursorSpriteRender.setSprite(
				new Sprite(
					AssetManager.getImage('Cursor'),
					SpriteLayer.GUI,
					new Vector2(0, 0),
					0.5,
					true,
					true
				)
			);
			cursor.addComponent(cursorSpriteRender);

			mainMenu.addGameObject(cursor);
			//make cam
			let camera = Scene.createGameObject('Camera');
			let cam = new Camera();
			//c.controller = new PlatformerCameraController();
			camera.addComponent(cam);
			mainMenu.addGameObject(camera);

			var gui = Scene.createGameObject('GUI');
			gui.addComponent(new DynamicMenuMovement());
			mainMenu.addGameObject(gui);

			var menuBox = Scene.createGameObject('Menu');

			var guiBox = new GuiBox();
			guiBox.fillColor = 'Cornsilk';
			guiBox.width = 240 * 1.5;
			guiBox.height = 20 * 20;
			menuBox.addComponent(guiBox);
			gui.addChildGameObject(menuBox);

			//make button
			var button = Scene.createGameObject('Button');
			var bRenderer = new GuiButton();
			bRenderer.text = 'Start Game';
			bRenderer.font = 'Impact';
			bRenderer.textSize = 15;
			bRenderer.width = 200;
			bRenderer.hoverColor = 'DarkMagenta	';
			bRenderer.fillColor = 'Plum';
			bRenderer.textColor = 'White ';
			bRenderer.texStroke = true;
			bRenderer.textStrokeStyle = 'Black';
			bRenderer.textStrokeSize = 2;
			bRenderer.hoverStrokeSize = 2;
			bRenderer.onClick = () => {
				this.setScene('Game');
			};

			var menuImage = Scene.createGameObject('Menu Image');
			let sr = new SpriteRenderer();
			menuImage.addComponent(sr);
			sr.setSprite(
				new Sprite(
					AssetManager.getImage('Smiley'),
					SpriteLayer.FOREGROUND,
					new Vector2(0.5, 0.5),
					5,
					false
				)
			);
			menuImage.transform.position.y = 100;
			gui.addChildGameObject(menuImage);

			var dynMove = new DynamicMenuMovement();
			dynMove.distance = 2;
			dynMove.rotateSpeed = (-2 * Math.PI) / 16;
			button.addComponent(dynMove);
			button.addComponent(bRenderer);
			gui.addChildGameObject(button);
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
		this.drawSceneHierarchy();
	}

	drawSceneHierarchy() {
		var fontSize = 15;
		var buffer = 5;
		var height = buffer + this.currentScene.getGameObjectsLength();

		var ctx = CanvasCreator.context;
		if (ctx) {
			var pos = new Vector2(0, innerHeight - height * fontSize);
			ctx.fillStyle = 'rgba(128,127,255,0.8)';
			ctx.fillRect(pos.x, pos.y, 200, innerHeight - height * fontSize);
			ctx.font = `${fontSize}px Consolas`;
			ctx.fillStyle = 'White';
			ctx.fillText('Scene Hierarchy', pos.x + fontSize, pos.y + fontSize * 2);
			ctx.fillText(
				`"${this.currentScene.sceneName}"`,
				pos.x + fontSize,
				pos.y + fontSize * 3
			);
			var line = buffer;
			for (var go of this.currentScene.getGameObjects()) {
				var text = `${go.name}`;
				if (go.children.length > 0) {
					text += ` + ${go.children.length} Children`;
				}
				ctx.fillText(text, pos.x + fontSize, pos.y + fontSize * line);
				line++;
			}
		}
	}
}
