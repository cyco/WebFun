meta:
  id: yodesk
  file-extension: dta
  application: "Yoda Stories"
  endian: le
  encoding: ASCII
seq:
  - id: catalog
    type: catalog_entry
    repeat: until
    repeat-until: _.type == "ENDF"
types:
  catalog_entry:
    seq:
      - id: type
        type: str
        size: 4
      - id: content
        type:
          switch-on: type
          cases:
             '"VERS"': version
             '"STUP"': setup_image
             '"CHAR"': characters
             '"CAUX"': character_auxiliaries
             '"CHWP"': character_weapons
             '"PUZ2"': puzzles
             '"SNDS"': sounds
             '"TILE"': tiles
             '"TNAM"': tile_names
             '"ZONE"': zones
             '"ENDF"': endf
             _: unknown_case_error
  unknown_case_error:
    seq:
      - id: message
        contents: "Value did not match any expected type"
  version:
    seq:
      - id: version
        type: u4
  setup_image:
    seq:
      - id: size
        type: u4
      - id: pixels
        size: size
  sounds:
    seq:
      - id: size
        type: u4
      - id: count
        type: s2
      - id: sounds
        type: prefixed_strz
        repeat: expr
        repeat-expr: -count
  tile_names:
    seq:
      - id: size
        type: u4
      - id: names
        type: tile_name
        repeat: until
        repeat-until:  _.tile_id == -1
  tile_name:
    seq:
      - id: tile_id
        type: s2
      - id: name
        type: str
        size: 0x18
        if: tile_id != -1
  tiles:
    seq:
      - id: size
        type: u4
      - id: tiles
        type: tile
        repeat: expr
        repeat-expr: size / ( 32 * 32 + 4)
  tile:
      seq:
        - id: attributes
          type: u4
        - id: pixels
          size: 32 * 32

  action:
    seq:
      - id: marker
        contents: "IACT"
      - id: size
        type: u4
      - id: condition_count
        type: u2
      - id: conditions
        type: action_item
        repeat: expr
        repeat-expr: condition_count
      - id: instruction_count
        type: u2
      - id: instructions
        type: action_item
        repeat: expr
        repeat-expr: instruction_count
  action_item:
    seq:
      - id: opcode
        type: u2
      - id: arguments
        type: s2
        repeat: expr
        repeat-expr: 5
      - id: text_length
        type: u2
      - id: text
        type: str
        size: text_length
  monster:
    seq:
      - id: character
        type: u2
      - id: x
        type: u2
      - id: y
        type: u2
      - id: loot
        type: s2
      - id: drops_loot
        type: s4
      - id: waypoints
        type: waypoint
        repeat: expr
        repeat-expr: 4
  zone:
    seq:
      - id: planet
        type: u2
      - id: size
        type: u4
      - id: index
        type: u2
      - id: marker
        contents: "IZON"
      - id: size2
        type: u4
      - id: width
        type: u2
      - id: height
        type: u2
      - id: type
        type: u4
      - id: shared_counter
        type: u2
        # contents: 0xFF FF
      - id: planet_again
        type: u2
      - id: tile_ids
        type: u2
        repeat: expr
        repeat-expr: 3 * width * height
      - id: hotspot_count
        type: u2
      - id: hotspots
        type: hotspot
        repeat: expr
        repeat-expr: hotspot_count
      - id: izax
        type: zone_auxiliary
      - id: izx2
        type: zone_auxiliary_2
      - id: izx3
        type: zone_auxiliary_3
      - id: izx4
        type: zone_auxiliary_4
      - id: action_count
        type: u2
      - id: actions
        type: action
        repeat: expr
        repeat-expr: action_count
  hotspot:
    seq:
      - id: type
        type: u4
      - id: x
        type: u2
      - id: y
        type: u2
      - id: enabled
        type: u2
      - id: argument
        type: s2
  zone_auxiliary:
    seq:
      - id: marker
        contents: "IZAX"
      - id: size
        type: u4
      - id: unknown_count
        type: u2
      - id: monster_count
        type: u2
      - id: monsters
        type: monster
        repeat: expr
        repeat-expr: monster_count
      - id: required_item_count
        type: u2
      - id: required_items
        type: u2
        repeat: expr
        repeat-expr: required_item_count
      - id: goal_item_count
        type: u2
      - id: goal_items
        type: u2
        repeat: expr
        repeat-expr: goal_item_count
  zone_auxiliary_2:
     seq:
      - id: marker
        contents: "IZX2"
      - id: size
        type: u4
      - id: provided_item_count
        type: u2
      - id: provided_items
        type: u2
        repeat: expr
        repeat-expr: provided_item_count

  zone_auxiliary_3:
     seq:
      - id: marker
        contents: "IZX3"
      - id: size
        type: u4
      - id: npc_count
        type: u2
      - id: npc
        type: u2
        repeat: expr
        repeat-expr: npc_count
  zone_auxiliary_4:
     seq:
      - id: marker
        contents: "IZX4"
      - id: size
        type: u4
      - id: unknown
        type: u2
  zones:
    seq:
      - id: zone_count
        type: u2
      - id: zones
        type: zone
        repeat: expr
        repeat-expr: zone_count
  puzzles:
    seq:
      - id: size
        type: u4
      - id: puzzles
        type: puzzle
        repeat: until
        repeat-until: _.index == -1
  puzzle:
    seq:
      - id: index
        type: s2
      - id: marker
        if: index != -1
        contents: "IPUZ"
      - id: size
        type: u4
        if: index != -1
      - id: type
        type: u4
        if: index != -1
      - id: unknown1
        type: u4
        if: index != -1
      - id: unknown2
        type: u4
        if: index != -1
      - id: unknown3
        type: u2
        if: index != -1
      - id: strings
        type: prefixed_str
        repeat: expr
        repeat-expr: 5
        if: index != -1
      - id: item_1
        type: u2
        if: index != -1
      - id: item_2
        type: u2
        if: index != -1
  endf:
    seq:
      - id: empty
        type: u4
  characters:
    seq:
      - id: size
        type: u4
      - id: characters
        type: character
        repeat: until
        repeat-until: _.index == -1
  character:
    seq:
      - id: index
        type: s2
      - id: marker
        contents: "ICHA"
        if: index != -1
      - id: size
        type: u4
        if: index != -1
      - id: name
        type: strz
        size: 16
        if: index != -1
      - id: type
        type: s2
        if: index != -1
      - id: movement_type
        type: s2
        if: index != -1
      - id: probably_garbage_1
        type: s2
        if: index != -1
      - id: probably_garbage_2
        type: u4
        if: index != -1
      - id: frame_1
        type: char_frame
        if: index != -1
      - id: frame_2
        type: char_frame
        if: index != -1
      - id: frame_3
        type: char_frame
        if: index != -1
  char_frame:
    seq:
      - id: tiles
        type: s2
        repeat: expr
        repeat-expr: 0x8
  character_auxiliaries:
    seq:
      - id: size
        type: u4
      - id: auxiliaries
        type: character_auxiliary
        repeat: until
        repeat-until: _.index == -1
  character_auxiliary:
    seq:
      - id: index
        type: s2
      - id: damage
        type: s2
        if: index != -1
  character_weapons:
    seq:
      - id: size
        type: u4
      - id: weapons
        type: character_weapon
        repeat: until
        repeat-until: _.index == -1
  character_weapon:
    seq:
      - id: index
        type: s2
      - id: reference
        # if character is monster this is a reference to the their weapon (char idx)
        # otherwise this is the index of the gun sound
        type: u2
        if: index != -1
      - id: health
          # unverified
        type: u2
        if: index != -1
  # Utilities
  prefixed_str:
    seq:
      - id: length
        type: u2
      - id: content
        type: str
        size: length
  prefixed_strz:
    seq:
      - id: length
        type: u2
      - id: content
        type: strz
        size: length
  waypoint:
    seq:
    - id: x
      type: s4
    - id: y
      type: s4
