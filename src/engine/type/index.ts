import GameType from "./type";
import IndyGameType from "./indy";
import YodaGameType from "./yoda";
import IndyDemoGameType from "./indy-demo";
import YodaDemoGameType from "./yoda-demo";

export const Indy = new IndyGameType();
export const Yoda = new YodaGameType();
export const IndyDemo = new IndyDemoGameType();
export const YodaDemo = new YodaDemoGameType();
export { GameType };
