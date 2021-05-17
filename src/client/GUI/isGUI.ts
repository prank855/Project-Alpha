import { Camera } from '../Camera';
import { Align } from './Align';

export interface isGUI {
	camera: Camera | null;
	align: Align;
	onHover(): void;
	onClick(): void;
}
