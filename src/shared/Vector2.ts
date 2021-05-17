import { Align } from '../client/GUI/Align';

export class Vector2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	static zero() {
		return new Vector2(0, 0);
	}

	add(vec: Vector2): Vector2 {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	multiply(value: number | Vector2): Vector2 {
		if (value instanceof Vector2) {
			this.x *= value.x;
			this.y *= value.y;
		} else {
			this.x *= value;
			this.y *= value;
		}
		return this;
	}
	divide(value: number): Vector2 {
		if (value == 0) {
			return this;
		}
		this.x /= value;
		this.y /= value;
		return this;
	}

	normalize() {
		this.divide(this.getMagnitude());
		return this;
	}

	toString(): string {
		return `X: ${this.x.toFixed(2)}, Y: ${this.y.toFixed(2)}`;
	}

	getMagnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	static Distance(a: Vector2, b: Vector2): number {
		return Math.hypot(b.x - a.x, b.y - a.y);
	}

	static copy(vec: Vector2): Vector2 {
		return new Vector2(vec.x, vec.y);
	}

	static add(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x + b.x, a.y + b.y);
	}
	static multiply(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x * b.x, a.y * b.y);
	}
	static Align(align: Align): Vector2 {
		var out = Vector2.zero();
		switch (align) {
			case Align.TOP_LEFT:
				break;
			case Align.CENTER:
				out = new Vector2(0.5, 0.5);
				break;
			case Align.TOP_RIGHT:
				out = new Vector2(1, 0);
				break;
			case Align.TOP:
				out = new Vector2(0.5, 0);
				break;
			case Align.LEFT:
				out = new Vector2(0, 0.5);
				break;
			case Align.RIGHT:
				out = new Vector2(1, 0.5);
				break;
			case Align.BOTTOM_LEFT:
				out = new Vector2(0, 1);
				break;
			case Align.BOTTOM:
				out = new Vector2(0.5, 1);
				break;
			case Align.BOTTOM_RIGHT:
				out = new Vector2(1, 1);
				break;
		}
		return out;
	}
}
