import { Transform } from './Transform';
import { InputAction } from './InputAction';
export interface InputScript {
	called: boolean;
	transform: Transform | null;
	input(deltaTime: number, _inputs?: InputAction[]): void;
}
