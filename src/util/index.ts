import Color, { hsv2rgb, rgb, rgb2hsv, rgb2rgba, rgba } from "./color";
import { rand, randmod, srand } from "./random";

import Direction from "./direction";
import DiscardingOutputStream from "./discarding-output-stream";
import DiscardingStorage from "./discarding-storage";
import Event from "./event";
import PropertyChangeEvent from "./property-change-event";
import EventTarget from "./event-target";
import FetchInputStream from "./fetch-input-stream";
import FileLoader from "./file-loader";
import HorizontalPointRange from "./horizontal-point-range";
import InputStream from "./input-stream";
import LogLevel from "./log-level";
import Logger from "./logger";
import MouseButton from "./mouse-button";
import OutputStream from "./output-stream";
import Point from "./point";
import PointLike from "./point-like";
import PointRange from "./point-range";
import PrefixedStorage from "./prefixed-storage";
import QueryString from "./query-string";
import Range from "./range";
import ReaderStream from "./reader-stream";
import Rectangle from "./rectangle";
import Scanner from "./scanner";
import Size from "./size";
import SizeLike from "./size-like";
import Stream from "./stream";
import VerticalPointRange from "./vertical-point-range";
import add from "./add";
import astar from "./a-star";
import clamp from "./clamp";
import constantly from "./constantly";
import deg2rad from "./deg2rad";
import dispatch from "./dispatch";
import download from "./download";
import downloadImage from "./download-image";
import identity from "./identity";
import iterate from "./iterate";
import persistent from "./persistent";
import observable from "./observable";
import polar2xy from "./polar2xy";
import rad2deg from "./rad2deg";
import sleep from "./sleep";
import xy2polar from "./xy2polar";
import diff, { formatDifferences, Differences, Difference, DifferenceType } from "./diff";

const px = (a: number): string => `${a}px`;

export {
	Color,
	Difference,
	DifferenceType,
	Differences,
	Direction,
	DiscardingOutputStream,
	DiscardingStorage,
	Event,
	EventTarget,
	FetchInputStream,
	FileLoader,
	HorizontalPointRange,
	InputStream,
	LogLevel,
	Logger,
	MouseButton,
	OutputStream,
	Point,
	PointLike,
	PointRange,
	PrefixedStorage,
	PropertyChangeEvent,
	QueryString,
	Range,
	ReaderStream,
	Rectangle,
	Scanner,
	Size,
	SizeLike,
	Stream,
	VerticalPointRange,
	add,
	astar,
	clamp,
	constantly,
	deg2rad,
	diff,
	dispatch,
	download,
	downloadImage,
	formatDifferences,
	hsv2rgb,
	identity,
	iterate,
	observable,
	persistent,
	polar2xy,
	px,
	rad2deg,
	rand,
	randmod,
	rgb,
	rgb2hsv,
	rgb2rgba,
	rgba,
	sleep,
	srand,
	xy2polar
};
