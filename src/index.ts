import "babel-polyfill";

import "./_style/global.scss";
import "./extension";
import "./ui";
import "./util";
import "./debug";
import { main } from "./app";

window.addEventListener("load", main);
