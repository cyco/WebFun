declare let require: any;
import loadGameData from "test/helpers/game-data";
import { GameplayContext } from "src/app/webfun/debug/automation/test";
import { Zone } from "src/engine/objects";

declare global {
	var __webfun_coverage__: any;
}

describe("WebFun.Acceptance.InGameCoverage", () => {
	it("Setup", async () => {
		if (typeof window.__webfun_coverage__ === "undefined") return;

		const ctx = new GameplayContext(false);
		await ctx.prepare(loadGameData);
		ctx.buildEngine();
		ctx.engine.assets.getAll(Zone).forEach(z => {
			window.__webfun_coverage__.zones[z.id] = window.__webfun_coverage__.zones[z.id] || {};
			window.__webfun_coverage__.zones[z.id] = Object.assign(
				{
					id: `${z.id.toString()}`,
					type: z.type.name,
					visited: false,
					actionCount: z.actions.length,
					conditionCount: z.actions.reduce((a, b) => a + b.conditions.length, 0),
					instructionCount: z.actions.reduce((a, b) => a + b.instructions.length, 0)
				},
				window.__webfun_coverage__.zones[z.id]
			);
		});
		ctx.engine.assets.getAll(Zone).forEach(z =>
			z.actions.forEach(a => {
				const id = `${z.id.toString()}_${a.id.toString()}`;
				window.__webfun_coverage__.actions[id] = window.__webfun_coverage__.actions[id] || {};
				window.__webfun_coverage__.actions[id] = Object.assign(
					{
						conditions: a.conditions.map(_ => 0),
						instructions: a.instructions.map(_ => 0)
					},
					window.__webfun_coverage__.actions[id]
				);
			})
		);

		ctx.engine.assets.getAll(Zone).forEach(z =>
			z.actions.forEach(a => {
				a.instructions.forEach(
					({ opcode }) =>
						(window.__webfun_coverage__.instructions[opcode] =
							window.__webfun_coverage__.instructions[opcode] || 0)
				);
				a.conditions.forEach(
					({ opcode }) =>
						(window.__webfun_coverage__.conditions[opcode] =
							window.__webfun_coverage__.conditions[opcode] || 0)
				);
			})
		);

		await ctx.cleanup();
	});
});
