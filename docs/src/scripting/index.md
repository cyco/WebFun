Scripting
=========

The *Desktop Adventures* engine includes a binary scripting language. Each zone can have a number of *actions*. Each action consists of *conditions* and *instructions*.

Conditions and instructions have the following structure:

```typescript
type Condition = {
	opcode: number,
	arguments: number[5],
	text: string?
}
```

See [Conditions](./conditions.md) and [Instructions](./instructions.md) for a description of the known opcodes for conditions and instructions respectively.

### Execution

Actions are evaluated on the current zone. Once every condition of an action is satisfied all instructions are executed. Consider this mock execution engine:

```typescript
function execute(actions) {
	for (const action of actions) {
		if (action.conditions.every(condition => condition.isSatisfied()) {
			for (const instruction of action.instructions) {
				instruction.execute();
			}
		}
	}
}
```

### Registers

There are several registers available for use in scripts. All registers are local to the zone.

-	`counter` – A simple `16`-bit register
-	`sector-counter` – `16`-bit register that is propagated to connected rooms
-	`random` – `16`-bit register that can be set to random values
