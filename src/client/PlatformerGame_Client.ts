import { GuiBox } from './GUI/GuiBox';
import { PlatformerCameraController } from './PlatformerCameraController';
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
import { GuiButton } from './GUI/GuiButton';
import { Align } from './GUI/Align';
import { GuiText } from './GUI/GuiText';

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
			let gameScene = new Scene('Game');
			let background = Scene.createGameObject('Background');
			let bgImage = AssetManager.getImage('Background');
			let sr = new SpriteRenderer();
			sr.setSprite(
				new Sprite(bgImage, SpriteLayer.BACKGROUND, Align.CENTER, 0.5)
			);
			background.addComponent(sr);
			gameScene.addGameObject(background);

			{
				let camera = Scene.createGameObject('Camera');
				let cam = new Camera();
				cam.controller = new PlatformerCameraController();
				camera.addComponent(cam);
				for (var i = 0; i < 1; i++) {
					let player = Scene.createGameObject('Player');
					gameScene.addGameObject(player);
					let nameObject = Scene.createGameObject('Player Name');
					var guiText = new GuiText();
					guiText.text = 'You :D';
					guiText.textStroke = true;
					nameObject.addComponent(guiText);
					nameObject.transform.position.y = 20;

					player.addChildGameObject(nameObject);

					player.transform.position = new Vector2(
						Math.random() * 400,
						Math.random() * 400
					);
					let image = AssetManager.getImage('Smiley');
					let b = new SpriteRenderer();
					b.setSprite(
						new Sprite(image, SpriteLayer.FOREGROUND, Align.CENTER, 2, false)
					);
					player.addComponent(b);
					player.addComponent(new MovementScript());
					cam.target = player;
					cam.position = Vector2.copy(player.transform.position);
				}

				let cursor = Scene.createGameObject('Cursor');
				cursor.addComponent(new CursorManager());
				let cursorSpriteRender = new SpriteRenderer();
				cursorSpriteRender.setSprite(
					new Sprite(
						AssetManager.getImage('Cursor'),
						SpriteLayer.CURSOR,
						Align.CENTER,
						0.75,
						false,
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
			let mainMenu = new Scene('Main Menu');

			let cursor = Scene.createGameObject('Cursor');
			cursor.addComponent(new CursorManager());
			let cursorSpriteRender = new SpriteRenderer();
			cursorSpriteRender.setSprite(
				new Sprite(
					AssetManager.getImage('Cursor'),
					SpriteLayer.CURSOR,
					Align.CENTER,
					0.75,
					false,
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

			let gui = Scene.createGameObject('GUI');
			let dynMenu = new DynamicMenuMovement();
			dynMenu.scale = new Vector2(2, 0.5);
			gui.addComponent(dynMenu);
			mainMenu.addGameObject(gui);

			let menuBox = Scene.createGameObject('Menu');
			let guiBox = new GuiBox();
			guiBox.fillColor = 'Cornsilk';
			guiBox.width = 240 * 1.5;
			guiBox.height = 20 * 20;
			menuBox.addComponent(guiBox);
			gui.addChildGameObject(menuBox);

			//MAKES BUTTON
			{
				let button = Scene.createGameObject('Start Button');
				gui.addChildGameObject(button);
				// GuiButton Component
				{
					let guiButton = new GuiButton();
					guiButton.width = 200;
					guiButton.hoverColor = 'DarkMagenta	';
					guiButton.fillColor = 'Plum';
					guiButton.hoverStrokeSize = 2;
					guiButton.onClick = () => {
						this.setScene('Game');
					};
					button.addComponent(guiButton);
				}
				//GuiText Component
				{
					let guiText = new GuiText();
					guiText.text = 'Start Game';
					guiText.textFont = 'Impact';
					guiText.textSize = 15;
					guiText.textColor = 'White ';
					guiText.textStroke = true;
					guiText.textStrokeStyle = 'Black';
					guiText.textStrokeSize = 2;
					button.addComponent(guiText);
					console.log(1, button.parent?.transform);
				}
			}

			//MENU IMAGE
			{
				let menuImage = Scene.createGameObject('Menu Image');
				let sr = new SpriteRenderer();
				menuImage.addComponent(sr);
				sr.setSprite(
					new Sprite(
						AssetManager.getImage('Smiley'),
						SpriteLayer.GUI,
						Align.CENTER,
						5,
						false
					)
				);
				menuImage.transform.position.y = 100;
				gui.addChildGameObject(menuImage);
			}

			{
				let button = Scene.createGameObject('GitHub Button');
				button.transform.position.y = -40;
				gui.addChildGameObject(button);
				// GuiButton Component
				{
					let guiButton = new GuiButton();
					guiButton.width = 200;
					guiButton.hoverColor = 'DarkMagenta	';
					guiButton.fillColor = 'Plum';
					guiButton.hoverStrokeSize = 2;
					guiButton.onClick = () => {
						window.open('https://github.com/prank855/Project-Alpha', '_blank');
					};
					button.addComponent(guiButton);
				}
				//GuiText Component
				{
					let guiText = new GuiText();
					guiText.text = 'Open GitHub';
					guiText.textFont = 'Impact';
					guiText.textSize = 15;
					guiText.textColor = 'White ';
					guiText.textStroke = true;
					guiText.textStrokeStyle = 'Black';
					guiText.textStrokeSize = 2;
					button.addComponent(guiText);
					console.log(1, button.parent?.transform);
				}
			}

			//MENU IMAGE
			{
				let menuImage = Scene.createGameObject('Menu Image');
				let sr = new SpriteRenderer();
				menuImage.addComponent(sr);
				sr.setSprite(
					new Sprite(
						AssetManager.getImage('Smiley'),
						SpriteLayer.GUI,
						Align.CENTER,
						5,
						false
					)
				);
				menuImage.transform.position.y = 100;
				gui.addChildGameObject(menuImage);
			}

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
		if (document.visibilityState == 'visible') {
			SpriteManager.render();
			this.drawSceneHierarchy();
		}
	}

	drawSceneHierarchy() {
		let fontSize = 15;
		let buffer = 5;
		let height = buffer + this.currentScene.getGameObjectsLength();

		let ctx = CanvasCreator.context;
		if (ctx) {
			let pos = new Vector2(0, innerHeight - height * fontSize);
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
			let line = buffer;
			for (let go of this.currentScene.getGameObjects()) {
				let text = `${go.name}`;
				if (go.children.length > 0) {
					text += ` + ${go.children.length} Children`;
				}
				ctx.fillText(text, pos.x + fontSize, pos.y + fontSize * line);
				line++;
			}
		}
	}
}
