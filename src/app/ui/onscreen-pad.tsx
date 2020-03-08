import { Component } from "src/ui";
import "./onscreen-pad.scss";
import { min, max } from "src/std/math";
import InputMask from "src/engine/input/input-mask";
import { Point, Direction as DirectionHelper } from "src/util";

const BaseSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   sodipodi:docname="game-pad.svg"
   inkscape:version="1.0beta2 (2b71d25, 2019-12-03)"
   id="svg699"
   version="1.1"
   viewBox="0 0 42.32 42.32"
   height="42.32mm"
   width="42.32mm">
  <sodipodi:namedview
     inkscape:window-maximized="0"
     inkscape:window-y="23"
     inkscape:window-x="69"
     inkscape:window-height="855"
     inkscape:window-width="1348"
     showgrid="false"
     inkscape:document-rotation="0"
     inkscape:current-layer="g747"
     inkscape:document-units="px"
     inkscape:cy="78.660672"
     inkscape:cx="103.62916"
     inkscape:zoom="6.0876733"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     borderopacity="1.0"
     bordercolor="#666666"
     pagecolor="#ffffff"
     id="base"
     inkscape:pagecheckerboard="true"
     showguides="true" />
  <metadata
     id="metadata696">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     id="layer1"
     inkscape:groupmode="layer"
     inkscape:label="Layer 1">
    <g
       transform="translate(-0.76256686,-0.76256724)"
       id="g747">
      <path
         id="path1146"
         d="m 28.8084,0.76256727 q 1.322917,0 1.322917,1.32291593 V 12.668817 l -8.069792,8.069792 -8.069791,-8.069792 V 2.0854832 q 0,-1.32291593 1.322916,-1.32291593 H 28.8084 m 0.264584,1.32291593 q 0,-0.264583 -0.264584,-0.264583 H 15.31465 q -0.264583,0 -0.264583,0.264583 V 12.232254 l 7.011458,7.011459 7.011459,-7.011459 V 2.0854832"
         fill="url(#gradient38)"
         stroke="none"
         style="fill:#6d6d6d;stroke-width:0.264583;fill-opacity:1"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583"
         d="m 22.193817,4.7313173 q -0.105833,0 -0.185208,0.07937 l -1.322917,1.336145 h -0.01323 q -0.07937,0.07937 -0.06615,0.17198 l 0.01323,0.105833 q 0.06615,0.15875 0.238125,0.15875 h 2.659063 q 0.171979,0 0.238125,-0.15875 0.06615,-0.15875 -0.05292,-0.277813 l -1.336139,-1.336145 q -0.07938,-0.07937 -0.171979,-0.07937"
         id="path874"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583;fill:#cac6bc;fill-opacity:1"
         d="M 29.072984,2.0854832 V 12.232254 l -7.011459,7.011459 -7.011458,-7.011459 V 2.0854832 q 0,-0.264583 0.264583,-0.264583 H 28.8084 q 0.264584,0 0.264584,0.264583"
         id="up_bg"
         inkscape:connector-curvature="0" />
      <path
         style="fill:#6d6d6d;stroke-width:0.264583;fill-opacity:1"
         d="m 22.193817,4.7313173 q 0.0926,0 0.171979,0.07937 l 1.336146,1.336145 q 0.119062,0.119063 0.05292,0.277813 -0.06615,0.15875 -0.238125,0.15875 h -2.659063 q -0.171979,0 -0.238125,-0.15875 l -0.01323,-0.105833 q -0.01323,-0.0926 0.06615,-0.17198 h 0.01323 l 1.322912,-1.336145 q 0.07937,-0.07937 0.185208,-0.07937"
         id="up_arrow"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583;fill:#cac6bc;fill-opacity:1"
         d="m 42.024338,15.314643 v 13.493746 q 0,0.26459 -0.264584,0.26459 h -9.868958 l -7.011458,-7.011461 7.011458,-7.011458 h 9.868958 q 0.264584,0 0.264584,0.264583"
         id="right_bg"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583"
         d="m 37.711629,20.685692 q -0.119062,-0.119063 -0.277812,-0.05292 -0.15875,0.06614 -0.15875,0.238125 v 2.659061 q 0,0.17198 0.15875,0.238126 l 0.105833,0.01323 0.171979,-0.06615 v -0.01323 l 1.336146,-1.322916 0.07938,-0.185208 -0.07938,-0.171979 -1.336146,-1.336146"
         id="path876"
         inkscape:connector-curvature="0" />
      <path
         style="fill:#6d6d6d;stroke-width:0.264583;fill-opacity:1"
         d="m 37.711631,20.685691 1.336146,1.336146 0.07938,0.171979 -0.07938,0.185209 -1.336146,1.322916 v 0.01323 l -0.171979,0.06615 -0.105833,-0.01323 q -0.15875,-0.06615 -0.15875,-0.238129 V 20.8709 q 0,-0.17198 0.15875,-0.238125 0.15875,-0.06615 0.277812,0.05292"
         id="right_arrow"
         inkscape:connector-curvature="0" />
      <path
         sodipodi:nodetypes="cscccssccssssccc"
         id="path1152"
         d="m 42.024338,15.31465 c 0,-0.176389 -0.08819,-0.264584 -0.264584,-0.264584 h -9.868958 l -7.011458,7.011459 7.011458,7.011456 h 9.868958 c 0.176389,0 0.264584,-0.08819 0.264584,-0.26458 V 15.31465 M 31.454234,13.991733 h 11.628334 c 0.881945,0 -6e-6,-0.88211 0,-1.65e-4 l 1.03e-4,16.14 c 6e-6,0.88194 0.881842,-2.57e-4 -1.03e-4,-2.57e-4 H 31.454234 l -8.069792,-8.069786 8.069792,-8.069792"
         fill="url(#gradient39)"
         stroke="none"
         style="fill:#6d6d6d;fill-opacity:1;stroke-width:0.264583"
         inkscape:connector-curvature="0" />
      <path
         style="stroke:#0000ff;stroke-width:0.264583"
         d="m 22.193817,39.127145 0.171979,-0.0794 1.336146,-1.33614 q 0.119062,-0.11907 0.05292,-0.27782 -0.06615,-0.15875 -0.238125,-0.15875 h -2.659063 q -0.171979,0 -0.238125,0.15875 l -0.01323,0.10584 q -0.01323,0.0926 0.06615,0.17198 h 0.01323 l 1.322917,1.33614 0.185208,0.0794"
         id="path882"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583;fill:#cac6bc;fill-opacity:1"
         d="m 29.072984,31.890795 v 9.86896 q 0,0.264579 -0.264584,0.264579 H 15.31465 q -0.264583,0 -0.264583,-0.264579 v -9.86896 l 7.011458,-7.01146 7.011459,7.01146"
         id="down_bg"
         inkscape:connector-curvature="0" />
      <path
         style="fill:#6d6d6d;stroke:none;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;fill-opacity:1"
         d="m 22.193819,39.127148 -0.185208,-0.0794 -1.322917,-1.33615 h -0.01323 q -0.07937,-0.0794 -0.06615,-0.17198 l 0.01323,-0.10583 q 0.06615,-0.15875 0.238125,-0.15875 h 2.659063 q 0.171979,0 0.238125,0.15875 0.06615,0.15875 -0.05292,0.27781 l -1.336146,1.33615 -0.171979,0.0794"
         id="down_arrow"
         inkscape:connector-curvature="0" />
      <path
         id="path1154"
         d="m 29.072984,31.890798 -7.011459,-7.01146 -7.011458,7.01146 v 9.86896 q 0,0.26458 0.264583,0.26458 H 28.8084 q 0.264584,0 0.264584,-0.26458 v -9.86896 m -7.011459,-8.50636 8.069792,8.06979 v 10.30553 q 0,1.32291 -1.322917,1.32291 H 15.31465 q -1.322916,0 -1.322916,-1.32291 v -10.30553 l 8.069791,-8.06979"
         fill="url(#gradient40)"
         stroke="none"
         style="fill:#6d6d6d;stroke-width:0.264583;fill-opacity:1"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583;fill:#cac6bc;fill-opacity:1"
         d="M 2.0854839,15.050067 H 12.232254 l 7.011459,7.011458 -7.011459,7.011457 H 2.0854839 q -0.264584,0 -0.264584,-0.26458 V 15.31465 q 0,-0.264583 0.264584,-0.264583"
         id="left_bg"
         inkscape:connector-curvature="0" />
      <path
         style="stroke-width:0.264583"
         d="m 6.4246499,20.632775 q -0.15875,-0.06615 -0.277812,0.05292 l -1.336146,1.336143 q -0.07937,0.07937 -0.07937,0.171979 0,0.105834 0.07937,0.185208 l 1.336146,1.322916 v 0.01323 q 0.07937,0.07938 0.171979,0.06615 l 0.105833,-0.01323 q 0.15875,-0.06615 0.15875,-0.238126 v -2.659061 q 0,-0.171981 -0.15875,-0.238125"
         id="path884"
         inkscape:connector-curvature="0" />
      <path
         style="fill:#6d6d6d;stroke-width:0.264583;fill-opacity:1"
         d="m 6.4246519,20.632775 q 0.15875,0.06615 0.15875,0.238125 v 2.659062 q 0,0.171979 -0.15875,0.238125 l -0.105833,0.01323 q -0.0926,0.01323 -0.171979,-0.06615 v -0.01323 l -1.336146,-1.322911 q -0.07937,-0.07937 -0.07937,-0.185209 0,-0.0926 0.07937,-0.171979 l 1.336146,-1.336146 q 0.119062,-0.119062 0.277812,-0.05292"
         id="left_arrow"
         inkscape:connector-curvature="0" />
      <path
         id="path1156"
         d="m 0.76256686,15.31465 q 0,-1.322917 1.32291704,-1.322917 H 12.668817 l 8.069792,8.069792 -8.069792,8.069786 H 2.0854839 q -1.32291704,0 -1.32291704,-1.32291 V 15.31465 M 2.0854839,15.050066 q -0.264584,0 -0.264584,0.264584 v 13.493751 q 0,0.26458 0.264584,0.26458 H 12.232254 l 7.011459,-7.011456 -7.011459,-7.011459 H 2.0854839"
         fill="url(#gradient41)"
         stroke="none"
         style="fill:#6d6d6d;stroke-width:0.264583;fill-opacity:1"
         inkscape:connector-curvature="0" />
    </g>
  </g>
</svg>
`;

const r = (t: string): SVGSVGElement => {
	const d = <div></div>;
	d.innerHTML = t;
	return d.firstElementChild as SVGSVGElement;
};
const px = (n: number) => n.toString() + "px";

const ThumbOffsetMax = 70;
const PadBaseRadius = 80;

class OnscreenPad extends Component implements EventListenerObject {
	public static readonly tagName = "wf-onscreen-pad";
	private _base: SVGSVGElement = r(BaseSVG);
	private _input: InputMask = InputMask.None;

	connectedCallback() {
		super.connectedCallback();

		this.positionThumb(0, 0);

		this.appendChild(this._base);

		this.addEventListener("touchstart", this);
		this.addEventListener("touchmove", this);
		this.addEventListener("touchend", this);
		this.addEventListener("mousedown", this);
	}

	handleEvent(event: TouchEvent | MouseEvent): void {
		if (event.type === "mousedown") {
			document.addEventListener("mouseup", this);
			document.addEventListener("mousemove", this);
		}

		if (event.type === "touchend" || event.type === "mouseup") {
			this.positionThumb(0, 0);
			document.removeEventListener("mouseup", this);
			document.removeEventListener("mousemove", this);
		} else {
			const touch =
				"touches" in event ? event.touches[0] : { clientX: event.clientX, clientY: event.clientY };
			const box = this.getClientRects()[0];
			const centerX = box.left + box.width / 2;
			const centerY = box.top + box.height / 2;

			const x = (touch.clientX - centerX) / 80;
			const y = (touch.clientY - centerY) / 80;

			this.positionThumb(x, y);
		}

		event.preventDefault();
		event.stopPropagation();
	}

	private positionThumb(x: number, y: number) {
		// TODO: Limit to circle instead of a rectangle
		x = max(min(x, 1), -1);
		y = max(min(y, 1), -1);

		let input: InputMask;
		const distance = this._distanceFromPoint(x, y);

		if (distance > 0.7) input |= InputMask.Walk;
		input |= this._directionInputFromAngle(x, y);

		this._input = input;
	}

	disconnectedCallback() {
		this.removeEventListener("touchstart", this);
		this.removeEventListener("touchmove", this);
		this.removeEventListener("touchend", this);
		this.removeEventListener("mousedown", this);
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);

		super.disconnectedCallback();
	}

	private _directionInputFromAngle(x: number, y: number): number {
		let result = InputMask.None;

		if (x < -this.deadZone) result |= InputMask.Left;
		if (x > this.deadZone) result |= InputMask.Right;
		if (y < -this.deadZone) result |= InputMask.Up;
		if (y > this.deadZone) result |= InputMask.Down;

		return result;
	}

	private _distanceFromPoint(x: number, y: number): number {
		return new Point(0, 0).distanceTo(new Point(x, y));
	}

	private get deadZone() {
		return 0.4;
	}

	public get input(): InputMask {
		return this._input;
	}
}

export default OnscreenPad;
