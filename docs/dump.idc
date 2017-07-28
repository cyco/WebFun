#include <idc.idc>

static dumpWorld(seed, planet, size) {
  Message("testWorld(0x%04x, 0x%04x, 0x%04x);\n", seed, planet, size);
  SetSeed(seed);
  SetPlanet(planet);
  SetSize(size);

  auto logAddress = AddWorldDumpBreakpoint();

  auto eip;

  StartDebugger("", "", "");
  while (1) {
    auto end = 0;
    auto code = GetDebuggerEvent(WFNE_CONT | WFNE_SUSP, -1);
    if (code <= 0)
      return Failed(code);

    eip = GetRegValue("eip");

    if (eip != logAddress) {
		Message("UNKNOWN BREAKPOINT");
		return;
    }

    DumpWorld(seed, size, planet);

    StopDebugger();
    code = GetDebuggerEvent(WFNE_CONT | WFNE_SUSP, -1);
    break;
  }

  Message("done 0x%04x, 0x%04x, 0x%04x\n", seed, planet, size);
  DelBpt(logAddress);
}

static SetSeed(seed) {
  DelBpt(0x422243);

  auto bpt = Breakpoint();
  bpt.set_abs_bpt(0x422243);
  bpt.type = 4;
  bpt.flags = 9;
  bpt.condition = sprintf("ebp = 0x%04x, DelBpt(0x422243), 0", seed);
  bpt.elang = "IDC";
  Breakpoints.AddToGroup(bpt, "Temp2");
}

static SetPlanet(planet) {
  DelBpt(0x41D631);

  auto bpt = Breakpoint();
  bpt.set_abs_bpt(0x41D631);
  bpt.type = 4;
  bpt.flags = 9;
  bpt.condition = sprintf("PatchDword(Dword(ebp-0x10)+0x2e3c, 0x%x), DelBpt(0x41D631), 0", planet);
  bpt.elang = "IDC";
  Breakpoints.AddToGroup(bpt, "Temp2");
}

static SetSize(size) {
  DelBpt(0x0041D4E2);

  auto bpt = Breakpoint();
  bpt.set_abs_bpt(0x0041D4E2);
  bpt.type = 4;
  bpt.flags = 9;
  bpt.condition = sprintf("PatchDword(Dword(ebp-0x10)+0x3328, 0x%x), DelBpt(0x0041D4E2), 0", size);
  bpt.elang = "IDC";
  Breakpoints.AddToGroup(bpt, "Temp2");
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
  auto address = 0x423BA2;
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
  auto world_things_2 = document + 0x1900;

  auto seed = Dword(document + 0x2CC);
  auto planet = Dword(document + 0x2e3c);
  auto size = Dword(document + 0x3328);

  if (oseed != seed) {
    Message("seed mismatch\n");
    return 0;
  }
  if (osize != size) {
    Message("size mismatch\n");
    return 0;
  }
  if (oplanet != planet) {
    Message("planet mismatch\n");
    return 0;
  }

  Message("\n\n===>");
  Message("0x%04x, 0x%04x, 0x%04x", seed, planet, size);

  auto i, offset;
  for (i = 0; i < 100; i++) {
    offset = world_things + i * 0x34;

    Message(", 0x%04x", Word(offset + 0x4));  // zone_id
    Message(", 0x%04x", Word(offset + 0x8));  // zone_type
    Message(", 0x%04x", Word(offset + 0xC));  // field_C
    Message(", 0x%04x", Word(offset + 0xE));  // field_Ea
    Message(", 0x%04x", Word(offset + 0x10)); // required_item_id
    Message(", 0x%04x", Word(offset + 0x12)); // tile_id_2
    Message(", 0x%04x", Word(offset + 0x14)); // find_item_id
    Message(", 0x%04x", Word(offset + 0x16)); // field_16
    Message(", 0x%04x", Word(offset + 0x18)); // field_18
    Message(", 0x%04x", Word(offset + 0x1A)); // field_1A
  }

  Message("\n\n");
  return 1;
}



static DumpDagobah(oseed, osize, oplanet) {
  auto ebx = GetRegValue("ebx");

  auto document = ebx;
  auto world_things = document + 0x4b0;
  auto world_things_2 = document + 0x1900;

  auto seed = Dword(document + 0x2CC);
  auto planet = Dword(document + 0x2e3c);
  auto size = Dword(document + 0x3328);

  if (oseed != seed) {
    Message("seed mismatch\n");
    return 0;
  }
  if (osize != size) {
    Message("size mismatch\n");
    return 0;
  }
  if (oplanet != planet) {
    Message("planet mismatch\n");
    return 0;
  }

  Message("\n\nD==>");
  
  auto i, offset;
  for (i = 0; i < 100; i++) {
    offset = world_things_2 + i * 0x34;

    Message(", 0x%04x", Word(offset + 0x4));  // zone_id
    Message(", 0x%04x", Word(offset + 0x8));  // zone_type
    Message(", 0x%04x", Word(offset + 0xC));  // field_C
    Message(", 0x%04x", Word(offset + 0xE));  // field_Ea
    Message(", 0x%04x", Word(offset + 0x10)); // required_item_id
    Message(", 0x%04x", Word(offset + 0x12)); // tile_id_2
    Message(", 0x%04x", Word(offset + 0x14)); // find_item_id
    Message(", 0x%04x", Word(offset + 0x16)); // field_16
    Message(", 0x%04x", Word(offset + 0x18)); // field_18
    Message(", 0x%04x", Word(offset + 0x1A)); // field_1A
  }

  Message("\n\n");
  return 1;
}


static playWorld(seed, planet, size) {
  Message("playWorld(0x%04x, 0x%04x, 0x%04x);\n", seed, planet, size);
  SetSeed(seed);
  SetPlanet(planet);
  SetSize(size);

  auto worldDumpAddress = AddWorldDumpBreakpoint();
  auto dagobahDumpAddress = AddDagobahDumpBreakpoint();

  auto eip;

  StartDebugger("", "", "");
  while (1) {
    auto end = 0;
    auto code = GetDebuggerEvent(WFNE_CONT | WFNE_SUSP, -1);
    if (code <= 0)
      return Failed(code);

    eip = GetRegValue("eip");

    if (eip == worldDumpAddress) {
		DumpWorld(seed, size, planet);
    }
	
	if(eip == dagobahDumpAddress) {
		DumpDagobah(seed, size, planet);		
	}

	return;
  }

  Message("done 0x%04x, 0x%04x, 0x%04x\n", seed, planet, size);
  DelBpt(logAddress);
}

static main() {
  playWorld(0x1389, 1, 2);
}
