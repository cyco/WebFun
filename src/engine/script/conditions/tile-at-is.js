export default (args, zone, engine) => engine.state.currentZone.getTileID(args[1], args[2], args[3]) === args[0];
