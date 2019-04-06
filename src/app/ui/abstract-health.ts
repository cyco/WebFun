import "./abstract-health.scss";

import { PI, cos, floor, max, min, sin } from "src/std/math";

import { Component } from "src/ui";

const HealthSVG =
	'<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" height="43" version="1.1" width="43"><g transform="matrix(0.21500001,0,0,0.215,0,9.5140266e-7)"><g transform="matrix(1.0025057,0,0,1.0027319,-2.3574243,-282.67661)"><path d="m 101.85868,381.36758 64.9448,-76.04059 A 100,100 0 0 1 36.913868,457.40818 Z" style="fill:#ffffff;"/><path style="fill:#6D6D6D;" d="m 102.3445,381.90046 64.9448,-76.0406 A 100,100 0 0 0 37.399688,457.94105 Z"/></g><circle id="health-condition" style="fill:#00FF00;" cx="100" cy="100" r="89"/><path id="health-pie" style="fill:#6D6D6D;" d="m 0,0 Z"/></g></svg>';

const GoodColor = "lime";
const MediumColor = "yellow";
const BadColor = "red";
const CriticalColor = "black";
const Conditions = [CriticalColor, BadColor, MediumColor, GoodColor, GoodColor];

const MaxHealth = 300;
const HealthPerColor = 100;

declare interface SimplePoint {
	x: number;
	y: number;
}

abstract class AbstractHealth extends Component {
	static readonly GoodColor = GoodColor;
	static readonly MediumColor = MediumColor;
	static readonly BadColor = BadColor;
	static readonly CriticalColor = CriticalColor;
	static readonly Conditions = Conditions;
	private _condition: SVGCircleElement = null;
	private _pie: SVGPathElement = null;
	private _health: number;

	constructor() {
		super();

		this._condition = null;
		this._pie = null;

		this.health = 300;
	}

	get health() {
		return this._health;
	}

	set health(value) {
		this._health = max(0, min(value, MaxHealth));
		this._update();
	}

	get lives() {
		return floor(this._health / HealthPerColor);
	}

	get damage() {
		return HealthPerColor - (floor(this._health % HealthPerColor) || 1);
	}

	protected connectedCallback() {
		super.connectedCallback();
		this.innerHTML = HealthSVG;
		this._condition = this.querySelector("#health-condition");
		this._pie = this.querySelector("#health-pie");

		this._update();
	}

	private _update() {
		if (!this.isConnected) return;

		const health = this.health === MaxHealth - 1 ? MaxHealth : this.health;

		const condition = floor(health / HealthPerColor);
		this._condition.style.fill = Conditions[condition];

		const value = (health % HealthPerColor) / HealthPerColor;
		this._pie.style.fill = Conditions[condition + 1];
		this._pie.setAttribute("d", "M100,100 L" + this._buildArc(value) + "Z");
	}

	private _buildArc(value: number): string {
		const c = {
			x: 100,
			y: 100
		};
		const r = 90;

		const start = this._pointWithAngle(0, c, r);
		const end = this._pointWithAngle(360 * value, c, r);

		const sweep = value > 0.5 ? 1 : 0;
		return `${start.x},${start.y} A${r},${r},0,${sweep},0,${end.x},${end.y} `;
	}

	private _toRadians(angle: number): number {
		return (PI * angle) / 180;
	}

	private _pointWithAngle(angle: number, c: SimplePoint, r: number): SimplePoint {
		return {
			x: c.x + r * cos(this._toRadians(270 - angle)),
			y: c.y + r * sin(this._toRadians(270 - angle))
		};
	}
}

export default AbstractHealth;
