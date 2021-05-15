import { InputAction } from './InputAction';
export interface InputScript {
	input(deltaTime: number, _inputs?: InputAction[]): void;
}
