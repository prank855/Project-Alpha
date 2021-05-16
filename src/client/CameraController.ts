import { Camera } from './Camera';

export abstract class CameraController {
	abstract update(camera: Camera): void;
}
