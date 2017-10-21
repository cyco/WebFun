import "babel-polyfill";

import "./_style/global.scss";
import { main } from "./app";
import "./debug";
import "./extension";
import "./ui";
import "./util";

window.addEventListener("load", main);
