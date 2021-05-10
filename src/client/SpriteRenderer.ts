import { GameComponent } from '../shared/GameComponent';
import { Transform } from '../shared/Transform';
import { CanvasCreator } from './CanvasCreator';

export class SpriteRenderer extends GameComponent {
	constructor() {
		super();
	}

	render() {
		var transform: Transform = this.parent?.getComponent(
			'Transform'
		) as Transform;
		if (CanvasCreator.context != null)
			CanvasCreator.context.fillStyle = 'White';
		CanvasCreator.context?.fillRect(
			transform?.position.x,
			transform?.position.y,
			20,
			20
		);
	}
}
