#include <idc.idc>
#include "base.idc"

static installMessageBreakpoints(){
  auto bpt;

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x404a12);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"Generate World\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x404cb0);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"place_intermediate_world_thing()\\n\"),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x404fb9);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"inc something\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41e98c);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ZoneLeadsToItem => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x424200);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5(...)\\n\"),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4243b8);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4243c4);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42454f);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42471b);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ea23);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ZoneLeadsToItem => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41eadb);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChoosePuzzleNPCForZone(%d)\\n\", Word(ebp + 0x8)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ebd1);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChoosePuzzleNPCForZone => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ec86);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChoosePuzzleNPCForZone_0 => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ed33);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChoosePuzzleNPCForZone_0 => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ed69);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ee21);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f1ae);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::Unknown_7(%d, %d, %d, %d, %d)\\n\", Word(esp + 0x30),\n              Word(esp + 0x34), Word(esp + 0x38), Dword(esp + 0x3C),\n              Dword(esp + 0x40)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f1c7);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f1d9);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f24b);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f32f);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f33b);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f448);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f480);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_7 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f670);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_1(%d, %d, %d, %d, %d)\\n\", Word(esp+0x4), Word(esp+0x8), Word(esp+0xC), Word(esp+0x10), Word(esp+0x14)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f7bd);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_1() => %d\\n\", eax);";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f7c0);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_14(%d, %d, %d, %d)\\n\", Word(esp+0x4), Word(esp+0x8), Word(esp+0xC), Word(esp+0x10)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f959);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_14 => %d\\n\", eax);";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f970);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1(%d, %d, %d, %d)\\n\", Word(esp+0x4), Word(esp+0x8), Word(esp+0xC), Word(esp+0x10)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f996);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f9b2);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f9c4);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f9d9);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41faa8);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41fafe);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_1 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41fd20);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::AssociateItemWithZoneHotspot => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41ff20);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::HasQuestRequiringItem(%d)\\n\", Word(esp + 0x4)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4200dd);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::AddRequiredQuestWithItemID(%d, %d)\\n\",\n              Word(ebp + 0x8), Word(ebp + 0xC)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x420181);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::WorldContainsZoneID(%d)\\n\", Word(esp + 0x8)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42019d);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::WorldContainsZoneID => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4201c3);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::WorldContainsZoneID => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4201cd);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::WorldContainsZoneID => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4201f0);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::PlacePuzzleLocations(%d, %d, %d, %d)\\n\", Word(esp+0x4), Word(esp+0x8), Word(esp+0x10), Word(esp+0x18)),1;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x420c04);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"MapGenerator::PlaceTransports(%d)\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42137b);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::GetNewPuzzleID(%d, %d, %d, %d)\\n\", Word(ebp + 0x8)&0xFFFF,\nWord(ebp + 0xC)&0xFFFF, Word(ebp + 0x10)&0xFFFF, Word(ebp + 0x14)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42159d);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::GetNewPuzzleID => 0x%0x (%d)\\n\", eax, eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4218b6);
  bpt.type=4;
  bpt.flags=1;
  bpt.condition="Message(\"Array::Shuffle rand 1: %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4220f4);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ZoneDoesNOTProvideRequiredItemID(%d)\\n\",\n              Word(esp + 0x1C)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42210f);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ZoneDoesNOTProvideRequiredItemID => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x422188);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ZoneDoesNOTProvideRequiredItemID => %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x422190);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::AddRequiredItemsFromHotspots(%d)\\n\",\n              Word(esp + 0x4)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x422245);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"Generate New World (win, 0x%x)\\n\", ebp),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42269f);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"AdditionalPuzzleLocations(%d)\\n\", eax),0;\n";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x422b57);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"No new puzzle id!\\n\"),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x422f09);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"After Transport Loop\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x423c10);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"Generate new world => %x\\n\", eax), 1;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x423f00);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::place_puzzles__(%d, .., .., ..)\\n\", Word(ebp+0x8)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4243b8);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax)";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4243c4);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax)";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42446e);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"y = %d\\n\", Word(esp+0x1C)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42456b);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"x = %d\\n\", Word(esp+0x18)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4245c2);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"x = %d\\n\", Word(esp+0x18)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x424667);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"y = %d\\n\", Word(esp+0x1C)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42471b);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::Unknown_5 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42875a);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"mode: %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42af0e);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"rand: %x\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$403F50", 0xe);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::RemoveEmptyZoneIDsFromWorld()\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41E850", 0x18);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_2(%d, %d, %d)\\n\",\n              Word(esp + 0x20), Word(esp + 0x24), Word(esp + 0x28)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41E960", 0x14);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ZoneLeadsToItem(%d, %d)\\n\", Word(esp + 0x20),\n              Word(esp + 0x24)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41ED40", 0x16);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone(%d, %d, %d)\\n\",\n              Word(esp + 0x1C), Word(esp + 0x20), Word(esp + 0x24)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41EE30", 0x20);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_0(%d, %d)\\n\", Word(ebp + 0x8),\n              Word(ebp + 0xC)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41EE30", 0x23);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"v16 = %d\\n\", Word(ebp - 0x30)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41EE30", 0x73);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_0 => %d\\n\" ,eax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41EFE0", 0x1b);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseSpawnForPuzzleNPC(%d, %d)\\n\",\n              Word(ebp + 0x8), Word(ebp + 0xC)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41F490", 0x14);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::use_ids_from_array_1(%d, %d, %d, %d)\\n\",\n              Word(esp + 0x20), Word(esp + 0x24), Word(esp + 0x28),\n              Word(esp + 0x2C)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41FB10", 0x1e);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::AssociateItemWithZoneHotspot(%d, %d, %d)\\n\",\n              Word(ebp + 8), Word(ebp + 0xC), Word(ebp + 0x10)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41FD30", 0x19);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::SetupRequiredItemForZone_(%d, %d, %d)\\n\",\n              Word(ebp + 8), Word(ebp + 0xC), Word(ebp + 0x10)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$41FF60", 0xe);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::AddProvidedQuestWithItemID(%d, %d)\\n\",\n              Word(ebp + 8), Word(ebp + 0xC)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$420050", 0x16);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::RemoveQuestRequiringItem(%d)\\n\", Word(esp+0x10)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$4201D0", 0x3);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::AddZoneWithIDToWorld(%d)\\n\", Word(esp + 0x4)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$4201F0", 0x68);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"%dx%d\\n\", Word(esp+0x20), esi), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$4211D0", 0x1a);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::GetItemIDThatsNotRequiredYet(%d, %d, %d)\\n\", Word(ebp + 0x8), Word(ebp + 0xC), Word(ebp + 0x10)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$4219D0", 0x28);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::GetZoneIDWithType(%d, %d, %d, %d, %d, %d, %d)\\n\", Word(ebp + 0x8)&0xFFFF, Word(ebp + 0xC)&0xFFFF, Word(ebp + 0x10)&0xFFFF,  Word(ebp + 0x14)&0xFFFF, Word(ebp + 0x18)&0xFFFF, Word(ebp + 0x1C)&0xFFFF, Word(ebp + 0x20)&0xFFFF), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x1ef);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"AdditionalPuzzleLocations: %dx%d\\n\", Word(esp+0x30), ebp), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x39d);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"transport loop: %dx%d\\n\", Word(esp+0x2C), Word(esp+0x44)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x450);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"y_2 = %d\\n\", Word(esp+0x14)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x455);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"v206 = %d\\n\", Word(esp+0x28)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x45b);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"Do Cleanup\\n\"),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x493);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"x_4 = %d\\n\", Word(esp+0x18)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x4a0);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"v198 = %d\\n\", Word(esp+0x14)), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x4a7);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"After Loop 1\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x523);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"Do Cleanup\\n\"),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x582);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"After Loop 2\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x67e);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"After Loop 3\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$422210", 0x682);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"Do Cleanup\\n\"),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$423EF0", 0x48);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"1) %dx%d\\n\", ebx, esi),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$423EF0", 0x5a);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"2) %dx%d\\n\", ebx, esi),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_src_bpt("$423EF0", 0x9f);
  bpt.type=4;
  bpt.flags=9;
  bpt.condition="Message(\"YodaDocument::place_puzzles__: %dx%d\\n\", Word(eax), Word(eax+4)),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41f04b);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseSpawnForPuzzleNPC => %d\\n\", eax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x403550);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::WriteTatooineValues()\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4038a0);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::WriteHothValues()\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x403bf0);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::WriteEndorValues()\\n\"), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x404a1e);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::Reseed\\n\"),0";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x423bd7);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::WriteValues Done\\n\"),0";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x4286f0);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::SetupDagobah\\n\"),0";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x421ab5);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::GetZoneIDWithType => %d\\n\",ax), 0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41e87c);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_2 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x41e94f);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"YodaDocument::ChooseItemIDFromZone_2 => %d\\n\", eax),0;";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");

  bpt = Breakpoint();
  bpt.set_abs_bpt(0x42186b);
  bpt.type=4;
  bpt.flags=8;
  bpt.condition="Message(\"Array::Shuffle %d items\\n\", Word(ebp-0xE));";
  bpt.elang="IDC";
  Breakpoints.AddToGroup(bpt, "Logging");
  Breakpoints.Add(bpt);
}

static logWorldGeneration(seed, planet, size)
{
    installMessageBreakpoints();
    startWorld(seed, planet, size, 1);
}
