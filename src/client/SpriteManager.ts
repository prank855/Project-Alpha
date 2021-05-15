import { Sprite } from './Sprite';

export class SpriteManager {
	sprites: Sprite[] = [];
	render() {
		for (var s of this.sprites) {
			s.render();
		}
	}
}
