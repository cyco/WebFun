import * as Result from '../result';

export default (instruction, engine, action) => {
	/*
 	case DrawTileNow:
    tile_2 = document->tiles.ptrs[instruction->arg3];
    if ( tile_2 )
    {
      SetPixelsForRectWithTransparancey(
        document->hdc_surface,
        (int)tile_2->pixels,
        0x20u,
        32,
        32 * LOWORD(instruction->arg1),
        32 * instruction->arg2,
        0);
      result_1 |= UpdateTiles;
    }
    goto fetch_next_instruction;
	*/
	return Result.UpdateTiles;
};