#include <idc.idc>
#include "base.idc"

static si(value){
	if(value == 0xFFFF) {
		return -1;
	}

	return value;
}

static AddWorldDumpBreakpoint() {
  auto address = 0x423BA2;
  DelBpt(address);

  auto bpt = Breakpoint();
  bpt.set_abs_bpt(address);
  Breakpoints.AddToGroup(bpt, "Temp2");

  return address;
}

static AddDagobahDumpBreakpoint() {
  auto address = 0x00428978;
  DelBpt(address);

  auto bpt = Breakpoint();
  bpt.set_abs_bpt(address);
  Breakpoints.AddToGroup(bpt, "Temp2");

  return address;
}

static DumpWorld(oseed, osize, oplanet) {
  auto ebx = GetRegValue("ebx");

  auto document = ebx;
  auto world_things = document + 0x4b0;

  auto seed = Dword(document + 0x2CC);
  auto planet = Dword(document + 0x2e3c);
  auto size = Dword(document + 0x3328);

  if (oseed != seed) {
    Message("seed mismatch\n");

    Message("\n\n");
    Message("{\"seed\":%d,\"planet\":%d,\"size\":%d,\"world\":null", oseed, oplanet, osize);
    return 0;
  }
  if (osize != size) {
    Message("size mismatch\n");
  	auto address = 0x00428978;
  	DelBpt(address);

    return 0;
  }
  if (oplanet != planet) {
    Message("planet mismatch\n");

  	auto address = 0x00428978;
  	DelBpt(address);

    return 0;
  }

  Message("\n\n");
  Message("{\"seed\":%d,\"planet\":%d,\"size\":%d,\"world\":[", oseed, oplanet, osize);

  auto i, offset;
  for (i = 0; i < 100; i++) {
	if(i != 0) {
		Message(",");
	}
	dumpWorldThing(world_things, i);
  }
  Message("]");
  return 1;
}

static DumpDagobah(oseed, osize, oplanet) {
  auto ebx = GetRegValue("ebx");

  auto document = esi;
  auto world_things = document + 0x4b0;

  auto seed = Dword(document + 0x2CC);
  if(seed != oseed){
	  Message(",\"dagobah\":null}\n");
	  return 0;
  }

  Message(",\"dagobah\":[");

  auto i, offset;

  dumpWorldThing(world_things, 44); Message(",");
  dumpWorldThing(world_things, 45); Message(",");
  dumpWorldThing(world_things, 54); Message(",");
  dumpWorldThing(world_things, 55);

  Message("]}\n");
  return 1;
}

static dumpWorldThing(world_things, i) {
    auto offset = world_things + i * 0x34;

	Message("{");
	Message("\"zoneID\":%d,", si(Word(offset + 0x4)));
	Message("\"zoneType\":%d,", si(Word(offset + 0x8)));
    Message("\"requiredItemID\":%d,", si(Word(offset + 0x10)));
	Message("\"additionalRequiredItemID\":%d,", si(Word(offset + 0x12)));
    Message("\"findItemID\":%d,", si(Word(offset + 0x14)));
    Message("\"npcID\":%d,", si(Word(offset + 0x18)));
    Message("\"unknown\":[%d,%d,%d,%d]", si(Word(offset + 0xC))
						   			   , si(Word(offset + 0xE))
						   			   , si(Word(offset + 0x16))
						   			   , si(Word(offset + 0x1A)));
	Message("}");
}

static dumpWorld(seed, planet, size) {
  startWorld(seed, planet, size, 1);
}
