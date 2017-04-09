export default (args, zone, engine) => !engine.currentZone.actionsInitialized;
// TODO: validate against original implementation
/*
	case NOT_INITIALIZED:
		if ( mode != JustEntered )
		  goto condition_NOT_satisfied;
		if ( zone->visited? )
		  goto condition_NOT_satisfied;
		if ( !document )
		  goto condition_NOT_satisfied;
		zoneId = YodaDocument::GetZoneID(document, zone);
		if ( YodaDocument::GetLocationOfZoneWithID(document, zoneId, &x_ref, &y_ref) )
		{
		  if ( document->world_things_1[document->world_x + 10 * document->world_y].zone? == (Zone *)1 )
		    goto condition_NOT_satisfied;
		}
		break;
*/