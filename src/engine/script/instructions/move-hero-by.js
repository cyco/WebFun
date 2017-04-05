import ZoneScene from "/engine/scenes/zone-scene";
import * as Result from "../result";

export default (instruction, engine, action) => {
	/*
    v37 = instruction->arg4;
    v78 = instruction->arg3;
    v77 = v37;
    v70 = 0;
    v38 = instruction->arg1;
    if ( v38 == -1 )
      v38 = document->hero_x / 32;
    v39 = v38;
    *(_DWORD *)v83 = v38;
    v40 = instruction->arg2;
    if ( v40 == -1 )
      v40 = document->hero_y / 32;
    *(_DWORD *)v82 = v40;
    v86 = v40;
    do
    {
      if ( v78 != v39 || v77 != v86 )
      {
        if ( v77 != v86 )
        {
          v41 = -1;
          if ( v77 - v86 >= 0 )
            v41 = 1;
          *(_DWORD *)v82 = v86;
          v86 += v41;
          document->hero_y = 32 * v86;
        }
        if ( v78 != v39 )
        {
          v42 = -1;
          if ( v78 - v39 >= 0 )
            v42 = 1;
          *(_DWORD *)v83 = v39;
          v39 += v42;
          document->hero_x = 32 * v39;
        }
        YodaView::RedrawTile(view, v83[0], v82[0]);
        YodaDocument::UpdateViewport(document);
        YodaDocument::RedrawCurrentZone(document);
        YodaView::Draw_(view, context);
        now_1 = clock();
        duration_1 = 100 * instruction->arg5;
        end_1 = duration_1 + now_1;
        if ( duration_1 + now_1 > now_1 )
        {
          while ( end_1 > clock() )
            ;
        }
      }
      else
      {
        ++v70;
      }
      result_1 |= UpdateViewPort;
    }
    while ( !v70 );
    YodaView::Draw_(view, context);
    goto fetch_next_instruction;
	*/

	throw `method not implemented correctly`;

	// original implementation actually has a hard break here
	return Result.UpdateViewport;
};
