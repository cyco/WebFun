meta:
  id: yodasav
  file-extension: wld
  application: "Yoda Stories"
  endian: le
  encoding: ASCII
seq:
  - id: magic
    contents: "YODASAV44"
  - id: seed
    type: u4
  - id: planet
    type: u4
  - id: on_dagobah
    type: u4
  - id: puzzles1
    type: id_array
  - id: puzzles2
    type: id_array
  - id: dagobah
    type: dagobah
  - id: world
    type: world
  - id: inventory_count
    type: u4
  - id: inventory
    type: u2
    repeat: expr
    repeat-expr: inventory_count
  - id: current_zone
    type: u2
  - id: world_x
    type: u4
  - id: world_y
    type: u4
  - id: current_weapon
    type: s2
  - id: current_ammo
    type: s2
    if: current_weapon != -1
  - id: force_ammo
    type: s2
  - id: blaster_ammo
    type: s2
  - id: blaster_rifle_ammo
    type: s2
  - id: zone_x
    type: u4
  - id: zone_y
    type: u4
  - id: damage_taken
    type: u4
  - id: lives_left
    type: u4
  - id: difficulty
    type: u4
  - id: time_elapsed
    type: u4
  - id: world_size
    type: u2
  - id: unknown_array_count
    type: u2
  - id: unknown_array_sum
    type: u2
  - id: end_puzzle
    type: u4
  - id: end_puzzle_again
    type: u4

types:
  id_array:
    seq:
      - id: count
        type: u2
      - id: content
        type: u2
        repeat: expr
        repeat-expr: count
  world_thing:
    seq:
      - id: unknown1
        type: u4
      - id: unknown2
        type: u4
      - id: unknown3
        type: u4
      - id: unknown4
        type: u4
      - id: unknown5
        type: u4
      - id: zone_id
        type: u2
      - id: unknown6
        type: u2
      - id: required_item
        type: u2
      - id: provided_item
        type: u2
      - id: unknown7
        type: u2
      - id: additionally_required_item
        type: u2
      - id: unknown8
        type: u2
      - id: puzzle_npc
        type: u2
      - id: unknown9
        type: u4
      - id: unknown10
        type: u2
      - id: rooms
        type: room
  dagobah:
    seq:
      - id: world_things
        type: world_thing
        repeat: expr
        repeat-expr: 2 * 2
      - id: zones
        type: zone
        repeat: until
        repeat-until: _.unknown1 == -1 or _.unknown2 == -1
  world:
    seq:
      - id: world_things
        type: world_thing
        repeat: expr
        repeat-expr: 10 * 10
      - id: zones
        type: zone
        repeat: until
        repeat-until: _.unknown1 == -1 or _.unknown2 == -1
  rooms:
    seq:
      - id: rooms
        type: room
        repeat: until
        repeat-until: _.unknown1 == -1
  room:
    seq:
      - id: unknown1
        type: s4
      - id: unknown2
        type: s4
      - id: zone_id
        type: s2
        if: unknown1 == -1
      - id: unknown3
        type: u4
        if: unknown1 == -1
  zone:
    seq:
      - id: unknown1
        type: s4
      - id: unknown2
        type: s4
