import { GameComponent } from '../shared/GameComponent';
import { Sprite } from './Sprite';

export class SpriteRenderer extends GameComponent {
	static drawCount: number = 0;

	sprite: Sprite | null = null;

	constructor() {
		super('SpriteRenderer');
	}

	setSprite(sprite: Sprite) {
		this.sprite = sprite;
	}

	update() {
		if (this.sprite && this.parent) {
			this.sprite.position = this.parent?.transform.position;
			this.sprite.render();
		}
	}
}
