import "./_style/global.scss";
import "./extension";
import "./ui";
import "./util";
import "./debug";
import WebGLDebug from "/engine/rendering/webgl/debug.js";
import { main } from "./app";

window.addEventListener("load", main);
window.addEventListener('load', () => new WebGLDebug());
