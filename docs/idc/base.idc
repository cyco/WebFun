#include <idc.idc>

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

static startWorld(seed, planet, size, stop) {
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
		continue;
    }

	if (eip == dagobahDumpAddress) {
		DumpDagobah(seed, size, planet);

		if(stop) {
	    	StopDebugger();
			code = GetDebuggerEvent(WFNE_CONT | WFNE_SUSP, -1);
		}
		break;
	}

	return;
  }

  Message("done 0x%04x, 0x%04x, 0x%04x\n", seed, planet, size);
  DelBpt(worldDumpAddress);
  DelBpt(dagobahDumpAddress);
}

static playWorld(seed, planet, size) {
  startWorld(seed, planet, size, 0);
}
