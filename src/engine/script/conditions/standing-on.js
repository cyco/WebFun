export default (args, zone, engine) => engine.state.hero.location.x === args[0] && engine.state.hero.location.y === args[1] && zone.getTileID(args[0], args[1], 0) === args[2];

// TODO: validate against original implementation
/* case STANDS_ON:
                if ( mode != 1
                  || condition->arg1 != hero_x
                  || condition->arg2 != hero_y
                  || zone->tile_ids[3 * (hero_x + 18 * hero_y)] != condition->arg3 )
                {
                  goto condition_NOT_satisfied;
                }
                break;
*/