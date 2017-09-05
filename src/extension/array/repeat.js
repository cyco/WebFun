import { constantly } from "src/util";

Array.Repeat = (item, count) => Array.apply(null, Array(count)).map(constantly(item));

export default Array.Repeat;
