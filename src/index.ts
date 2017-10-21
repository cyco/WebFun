import "babel-polyfill";
import "./extension";

import "./_style/global.scss";
import { main } from "./app";

window.addEventListener("load", main);
