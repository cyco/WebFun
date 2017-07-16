import KaitaiStream from 'kaitai-struct/KaitaiStream';
// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

var Yodesk = (function() {
  function Yodesk(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this.catalog = []
    do {
      var _ = new CatalogEntry(this._io, this, this._root);
      this.catalog.push(_);
    } while (!(_.type == "ENDF"));
  }

  var TileName = Yodesk.TileName = (function() {
    function TileName(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.tileId = this._io.readS2le();
      if (this.tileId != -1) {
        this.name = KaitaiStream.bytesToStr(this._io.readBytes(24), "ASCII");
      }
    }

    return TileName;
  })();

  var PrefixedStr = Yodesk.PrefixedStr = (function() {
    function PrefixedStr(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.length = this._io.readU2le();
      this.content = KaitaiStream.bytesToStr(this._io.readBytes(this.length), "ASCII");
    }

    return PrefixedStr;
  })();

  var ZoneAuxiliary3 = Yodesk.ZoneAuxiliary3 = (function() {
    function ZoneAuxiliary3(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.marker = this._io.ensureFixedContents([73, 90, 88, 51]);
      this.size = this._io.readU4le();
      this.puzzleNpcCount = this._io.readU2le();
      this.puzzleNpc = new Array(this.puzzleNpcCount);
      for (var i = 0; i < this.puzzleNpcCount; i++) {
        this.puzzleNpc[i] = this._io.readU2le();
      }
    }

    return ZoneAuxiliary3;
  })();

  var Sounds = Yodesk.Sounds = (function() {
    function Sounds(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.count = this._io.readS2le();
      this.sounds = new Array(-this.count);
      for (var i = 0; i < -this.count; i++) {
        this.sounds[i] = new PrefixedStrz(this._io, this, this._root);
      }
    }

    return Sounds;
  })();

  var CharacterWeapons = Yodesk.CharacterWeapons = (function() {
    function CharacterWeapons(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.weapons = []
      do {
        var _ = new CharacterWeapon(this._io, this, this._root);
        this.weapons.push(_);
      } while (!(_.index == -1));
    }

    return CharacterWeapons;
  })();

  var ZoneAuxiliary = Yodesk.ZoneAuxiliary = (function() {
    function ZoneAuxiliary(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.marker = this._io.ensureFixedContents([73, 90, 65, 88]);
      this.size = this._io.readU4le();
      this.unknownCount = this._io.readU2le();
      this.npcCount = this._io.readU2le();
      this.npcs = new Array(this.npcCount);
      for (var i = 0; i < this.npcCount; i++) {
        this.npcs[i] = new Npc(this._io, this, this._root);
      }
      this.requiredItemCount = this._io.readU2le();
      this.requiredItems = new Array(this.requiredItemCount);
      for (var i = 0; i < this.requiredItemCount; i++) {
        this.requiredItems[i] = this._io.readU2le();
      }
      this.assignedItemCount = this._io.readU2le();
      this.assignedItems = new Array(this.assignedItemCount);
      for (var i = 0; i < this.assignedItemCount; i++) {
        this.assignedItems[i] = this._io.readU2le();
      }
    }

    return ZoneAuxiliary;
  })();

  var CharacterAuxiliaries = Yodesk.CharacterAuxiliaries = (function() {
    function CharacterAuxiliaries(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.auxiliaries = []
      do {
        var _ = new CharacterAuxiliary(this._io, this, this._root);
        this.auxiliaries.push(_);
      } while (!(_.index == -1));
    }

    return CharacterAuxiliaries;
  })();

  var ZoneAuxiliary2 = Yodesk.ZoneAuxiliary2 = (function() {
    function ZoneAuxiliary2(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.marker = this._io.ensureFixedContents([73, 90, 88, 50]);
      this.size = this._io.readU4le();
      this.providedItemCount = this._io.readU2le();
      this.providedItems = new Array(this.providedItemCount);
      for (var i = 0; i < this.providedItemCount; i++) {
        this.providedItems[i] = this._io.readU2le();
      }
    }

    return ZoneAuxiliary2;
  })();

  var PrefixedStrz = Yodesk.PrefixedStrz = (function() {
    function PrefixedStrz(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.length = this._io.readU2le();
      this.content = KaitaiStream.bytesToStr(KaitaiStream.bytesTerminate(this._io.readBytes(this.length), 0, false), "ASCII");
    }

    return PrefixedStrz;
  })();

  var Tiles = Yodesk.Tiles = (function() {
    function Tiles(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.tiles = new Array(Math.floor(this.size / ((32 * 32) + 4)));
      for (var i = 0; i < Math.floor(this.size / ((32 * 32) + 4)); i++) {
        this.tiles[i] = new Tile(this._io, this, this._root);
      }
    }

    return Tiles;
  })();

  var Characters = Yodesk.Characters = (function() {
    function Characters(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.characters = []
      do {
        var _ = new Character(this._io, this, this._root);
        this.characters.push(_);
      } while (!(_.index == -1));
    }

    return Characters;
  })();

  var TileNames = Yodesk.TileNames = (function() {
    function TileNames(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.names = []
      do {
        var _ = new TileName(this._io, this, this._root);
        this.names.push(_);
      } while (!(_.tileId == -1));
    }

    return TileNames;
  })();

  var Hotspot = Yodesk.Hotspot = (function() {
    function Hotspot(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.type = this._io.readU4le();
      this.x = this._io.readU2le();
      this.y = this._io.readU2le();
      this.enabled = this._io.readU2le();
      this.argument = this._io.readU2le();
    }

    return Hotspot;
  })();

  var Puzzle = Yodesk.Puzzle = (function() {
    function Puzzle(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.index = this._io.readS2le();
      if (this.index != -1) {
        this.marker = this._io.ensureFixedContents([73, 80, 85, 90]);
      }
      if (this.index != -1) {
        this.size = this._io.readU4le();
      }
      if (this.index != -1) {
        this.type = this._io.readU4le();
      }
      if (this.index != -1) {
        this.unknown1 = this._io.readU4le();
      }
      if (this.index != -1) {
        this.unknown2 = this._io.readU4le();
      }
      if (this.index != -1) {
        this.unknown3 = this._io.readU2le();
      }
      if (this.index != -1) {
        this.strings = new Array(5);
        for (var i = 0; i < 5; i++) {
          this.strings[i] = new PrefixedStr(this._io, this, this._root);
        }
      }
      if (this.index != -1) {
        this.item1 = this._io.readU2le();
      }
      if (this.index != -1) {
        this.item2 = this._io.readU2le();
      }
    }

    return Puzzle;
  })();

  var Npc = Yodesk.Npc = (function() {
    function Npc(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.face = this._io.readU2le();
      this.x = this._io.readU2le();
      this.y = this._io.readU2le();
      this.unknown1 = this._io.readU2le();
      this.unknown2 = this._io.readU4le();
      this.unknown3 = new Array(32);
      for (var i = 0; i < 32; i++) {
        this.unknown3[i] = this._io.readU1();
      }
    }

    return Npc;
  })();

  var Version = Yodesk.Version = (function() {
    function Version(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.version = this._io.readU4le();
    }

    return Version;
  })();

  var UnknownCaseError = Yodesk.UnknownCaseError = (function() {
    function UnknownCaseError(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.message = this._io.ensureFixedContents([86, 97, 108, 117, 101, 32, 100, 105, 100, 32, 110, 111, 116, 32, 109, 97, 116, 99, 104, 32, 97, 110, 121, 32, 101, 120, 112, 101, 99, 116, 101, 100, 32, 116, 121, 112, 101]);
    }

    return UnknownCaseError;
  })();

  var Character = Yodesk.Character = (function() {
    function Character(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.index = this._io.readS2le();
      if (this.index != -1) {
        this.marker = this._io.ensureFixedContents([73, 67, 72, 65]);
      }
      if (this.index != -1) {
        this.size = this._io.readU4le();
      }
      if (this.index != -1) {
        this.name = KaitaiStream.bytesToStr(KaitaiStream.bytesTerminate(this._io.readBytes(16), 0, false), "ASCII");
      }
      if (this.index != -1) {
        this.type = this._io.readU2le();
      }
      if (this.index != -1) {
        this.movementType = this._io.readU2le();
      }
      if (this.index != -1) {
        this.probablyGarbage1 = this._io.readS2le();
      }
      if (this.index != -1) {
        this.probablyGarbage2 = this._io.readU4le();
      }
      if (this.index != -1) {
        this.frame1 = new CharFrame(this._io, this, this._root);
      }
      if (this.index != -1) {
        this.frame2 = new CharFrame(this._io, this, this._root);
      }
      if (this.index != -1) {
        this.frame3 = new CharFrame(this._io, this, this._root);
      }
    }

    return Character;
  })();

  var ActionItem = Yodesk.ActionItem = (function() {
    function ActionItem(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.opcode = this._io.readU2le();
      this.arguments = new Array(5);
      for (var i = 0; i < 5; i++) {
        this.arguments[i] = this._io.readU2le();
      }
      this.textLength = this._io.readU2le();
      this.text = KaitaiStream.bytesToStr(this._io.readBytes(this.textLength), "ASCII");
    }

    return ActionItem;
  })();

  var ZoneAuxiliary4 = Yodesk.ZoneAuxiliary4 = (function() {
    function ZoneAuxiliary4(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.marker = this._io.ensureFixedContents([73, 90, 88, 52]);
      this.size = this._io.readU4le();
      this.unknown = this._io.readU2le();
    }

    return ZoneAuxiliary4;
  })();

  var CharacterAuxiliary = Yodesk.CharacterAuxiliary = (function() {
    function CharacterAuxiliary(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.index = this._io.readS2le();
      if (this.index != -1) {
        this.damage = this._io.readU2le();
      }
    }

    return CharacterAuxiliary;
  })();

  var CharacterWeapon = Yodesk.CharacterWeapon = (function() {
    function CharacterWeapon(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.index = this._io.readS2le();
      if (this.index != -1) {
        this.reference = this._io.readU2le();
      }
      if (this.index != -1) {
        this.health = this._io.readU2le();
      }
    }

    return CharacterWeapon;
  })();

  var CharFrame = Yodesk.CharFrame = (function() {
    function CharFrame(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.tiles = new Array(8);
      for (var i = 0; i < 8; i++) {
        this.tiles[i] = this._io.readS2le();
      }
    }

    return CharFrame;
  })();

  var SetupImage = Yodesk.SetupImage = (function() {
    function SetupImage(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.pixels = new Array(this.size);
      for (var i = 0; i < this.size; i++) {
        this.pixels[i] = this._io.readU1();
      }
    }

    return SetupImage;
  })();

  var Zones = Yodesk.Zones = (function() {
    function Zones(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.zoneCount = this._io.readU2le();
      this.zones = new Array(this.zoneCount);
      for (var i = 0; i < this.zoneCount; i++) {
        this.zones[i] = new Zone(this._io, this, this._root);
      }
    }

    return Zones;
  })();

  var Puzzles = Yodesk.Puzzles = (function() {
    function Puzzles(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.size = this._io.readU4le();
      this.puzzles = []
      do {
        var _ = new Puzzle(this._io, this, this._root);
        this.puzzles.push(_);
      } while (!(_.index == -1));
    }

    return Puzzles;
  })();

  var Zone = Yodesk.Zone = (function() {
    function Zone(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.planet = this._io.readU2le();
      this.size = this._io.readU4le();
      this.index = this._io.readU2le();
      this.marker = this._io.ensureFixedContents([73, 90, 79, 78]);
      this.size2 = this._io.readU4le();
      this.width = this._io.readU2le();
      this.height = this._io.readU2le();
      this.type = this._io.readU4le();
      this.unknown = this._io.readU2le();
      this.planetAgain = this._io.readU2le();
      this.tileIds = new Array(((3 * this.width) * this.height));
      for (var i = 0; i < ((3 * this.width) * this.height); i++) {
        this.tileIds[i] = this._io.readU2le();
      }
      this.hotspotCount = this._io.readU2le();
      this.hotspots = new Array(this.hotspotCount);
      for (var i = 0; i < this.hotspotCount; i++) {
        this.hotspots[i] = new Hotspot(this._io, this, this._root);
      }
      this.izax = new ZoneAuxiliary(this._io, this, this._root);
      this.izx2 = new ZoneAuxiliary2(this._io, this, this._root);
      this.izx3 = new ZoneAuxiliary3(this._io, this, this._root);
      this.izx4 = new ZoneAuxiliary4(this._io, this, this._root);
      this.actionCount = this._io.readU2le();
      this.actions = new Array(this.actionCount);
      for (var i = 0; i < this.actionCount; i++) {
        this.actions[i] = new Action(this._io, this, this._root);
      }
    }

    return Zone;
  })();

  var Endf = Yodesk.Endf = (function() {
    function Endf(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.empty = this._io.readU4le();
    }

    return Endf;
  })();

  var Action = Yodesk.Action = (function() {
    function Action(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.marker = this._io.ensureFixedContents([73, 65, 67, 84]);
      this.size = this._io.readU4le();
      this.conditionCount = this._io.readU2le();
      this.conditions = new Array(this.conditionCount);
      for (var i = 0; i < this.conditionCount; i++) {
        this.conditions[i] = new ActionItem(this._io, this, this._root);
      }
      this.instructionCount = this._io.readU2le();
      this.instructions = new Array(this.instructionCount);
      for (var i = 0; i < this.instructionCount; i++) {
        this.instructions[i] = new ActionItem(this._io, this, this._root);
      }
    }

    return Action;
  })();

  var CatalogEntry = Yodesk.CatalogEntry = (function() {
    function CatalogEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.type = KaitaiStream.bytesToStr(this._io.readBytes(4), "ASCII");
      switch (this.type) {
      case "SNDS":
        this.content = new Sounds(this._io, this, this._root);
        break;
      case "PUZ2":
        this.content = new Puzzles(this._io, this, this._root);
        break;
      case "STUP":
        this.content = new SetupImage(this._io, this, this._root);
        break;
      case "ENDF":
        this.content = new Endf(this._io, this, this._root);
        break;
      case "ZONE":
        this.content = new Zones(this._io, this, this._root);
        break;
      case "VERS":
        this.content = new Version(this._io, this, this._root);
        break;
      case "CAUX":
        this.content = new CharacterAuxiliaries(this._io, this, this._root);
        break;
      case "TNAM":
        this.content = new TileNames(this._io, this, this._root);
        break;
      case "TILE":
        this.content = new Tiles(this._io, this, this._root);
        break;
      case "CHWP":
        this.content = new CharacterWeapons(this._io, this, this._root);
        break;
      case "CHAR":
        this.content = new Characters(this._io, this, this._root);
        break;
      default:
        this.content = new UnknownCaseError(this._io, this, this._root);
        break;
      }
    }

    return CatalogEntry;
  })();

  var Tile = Yodesk.Tile = (function() {
    function Tile(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.attributes = this._io.readU4le();
      this.pixels = new Array((32 * 32));
      for (var i = 0; i < (32 * 32); i++) {
        this.pixels[i] = this._io.readU1();
      }
    }

    return Tile;
  })();

  return Yodesk;
})();

// Export for amd environments
if (typeof define === 'function' && define.amd) {
  define('Yodesk', [], function() {
    return Yodesk;
  });
}

// Export for CommonJS
if (typeof module === 'object' && module && module.exports) {
  module.exports = Yodesk;
}

export default Yodesk;
