import "babel-polyfill";
import "./_style/global.scss";

import { main } from "./app";
import "./extension";

window.addEventListener("load", main);
