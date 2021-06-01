import { InputAction } from '../shared/InputAction';
import { Time } from '../shared/Time';
import { Util } from '../shared/Util';
import { Camera } from './Camera';
import { CameraController } from './CameraController';
import { Input } from './Input';

export class PlatformerCameraController extends CameraController {
	update(camera: Camera) {
		var _inputs = Input.GetInputs();
		if (_inputs.includes(InputAction.ZOOM_IN)) {
			camera.zoom *= Math.E ** (Time.deltaTime * Math.log(camera.zoomSpeed));
		}
		if (_inputs.includes(InputAction.ZOOM_OUT)) {
			camera.zoom /= Math.E ** (Time.deltaTime * Math.log(camera.zoomSpeed));
		}
		camera.zoom = Util.bound(
			camera.zoom,
			1 / camera.zoomFactor,
			camera.zoomFactor
		);
		if (camera.target != null) {
			//lerp camera to target
			var xv =
				(camera.target.transform.position.x - camera.position.x) *
				Time.deltaTime *
				camera.speed *
				camera.zoom;
			if (xv > 0) {
				if (camera.position.x + xv > camera.target.transform.position.x) {
					camera.position.x = camera.target.transform.position.x;
				} else {
					camera.position.x += xv;
				}
			} else {
				if (camera.position.x + xv < camera.target.transform.position.x) {
					camera.position.x = camera.target.transform.position.x;
				} else {
					camera.position.x += xv;
				}
			}
			var yv =
				(camera.target.transform.position.y - camera.position.y) *
				Time.deltaTime *
				camera.speed *
				camera.zoom;
			if (yv > 0) {
				if (camera.position.y + yv > camera.target.transform.position.y) {
					camera.position.y = camera.target.transform.position.y;
				} else {
					camera.position.y += yv;
				}
			} else {
				if (camera.position.y + yv < camera.target.transform.position.y) {
					camera.position.y = camera.target.transform.position.y;
				} else {
					camera.position.y += yv;
				}
			}

			//check bounds
			if (
				camera.target.transform.position.x - camera.position.x >
				camera.boundBoxSize
			) {
				camera.position.x =
					camera.target.transform.position.x - camera.boundBoxSize;
			}
			if (
				camera.target.transform.position.x - camera.position.x <
				-camera.boundBoxSize
			) {
				camera.position.x =
					camera.target.transform.position.x + camera.boundBoxSize;
			}
			if (
				camera.target.transform.position.y - camera.position.y >
				camera.boundBoxSize
			) {
				camera.position.y =
					camera.target.transform.position.y - camera.boundBoxSize;
			}
			if (
				camera.target.transform.position.y - camera.position.y <
				-camera.boundBoxSize
			) {
				camera.position.y =
					camera.target.transform.position.y + camera.boundBoxSize;
			}
		}
	}
}
