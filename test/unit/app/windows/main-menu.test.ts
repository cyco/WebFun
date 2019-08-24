import MainMenu from "src/app/windows/main-menu";
import { GameController } from "src/app";
import { Menu, MenuItem, MenuItemState } from "src/ui";
import * as UX from "src/ux";
import { StatisticsWindow, WorldSizeWindow, GameSpeedWindow, DifficultyWindow } from "src/app/windows";
import Settings from "src/settings";

describe("WebFun.App.Windows.MainMenu", () => {
	let subject: MainMenu;
	let gameController: GameController;

	beforeEach(() => {
		gameController = ({
			settings: {},
			data: null,
			engine: null,
			newStory() {},
			replayStory() {},
			load() {},
			save() {}
		} as any) as GameController;
		subject = new MainMenu(gameController);
	});

	it("is the menu of the main window", () => {
		expect(subject).toBeInstanceOf(Menu);
	});

	describe("-> File", () => {
		let fileItem: MenuItem;
		let fileMenu: Menu;
		beforeEach(() => {
			fileItem = subject.items[0];
			fileMenu = fileItem.submenu;
		});

		it("is a file menu", () => {
			expect(fileItem.title).toEqual("File");
		});

		it("has a submenu with 6 entries", () => {
			expect(fileMenu.items).toBeArrayOfSize(6);
		});

		describe("->", () => {
			let newWorldItem: MenuItem;
			let replayStoryItem: MenuItem;
			let loadWorldItem: MenuItem;
			let saveWorldItem: MenuItem;
			let exitItem: MenuItem;

			beforeEach(() => {
				[newWorldItem, replayStoryItem, loadWorldItem, saveWorldItem, , exitItem] = fileMenu.items;
			});

			describe("New World", () => {
				it("has the right title", () => {
					expect(newWorldItem.title).toBe("New World");
				});

				it("is enabled when the game data is available", () => {
					expect(newWorldItem.enabled).toBeFalsy();
					gameController.data = {} as any;
					expect(newWorldItem.enabled).toBeTruthy();
				});

				it("starts a new story when clicked", () => {
					spyOn(gameController, "newStory");
					newWorldItem.callback();
					expect(gameController.newStory).toHaveBeenCalled();
				});
			});

			describe("Replay Story", () => {
				it("has the right title", () => {
					expect(replayStoryItem.title).toBe("Replay Story");
				});

				it("is enabled when a game is in progress", () => {
					expect(replayStoryItem.enabled).toBeFalsy();
					(gameController as any).engine = {};
					expect(replayStoryItem.enabled).toBeTruthy();
				});

				it("restarts the current story clicked", () => {
					spyOn(gameController, "replayStory");
					replayStoryItem.callback();
					expect(gameController.replayStory).toHaveBeenCalled();
				});
			});

			describe("Load World", () => {
				it("has the right title", () => {
					expect(loadWorldItem.title).toBe("Load World");
				});

				it("is enabled when the game data is available", () => {
					expect(loadWorldItem.enabled).toBeFalsy();
					gameController.data = {} as any;
					expect(loadWorldItem.enabled).toBeTruthy();
				});

				it("prompts to load a new story when clicked", () => {
					spyOn(gameController, "load");
					loadWorldItem.callback();
					expect(gameController.load).toHaveBeenCalled();
				});
			});
			describe("Save World", () => {
				it("has the right title", () => {
					expect(saveWorldItem.title).toBe("Save World");
				});

				it("is enabled when a game is in progress", () => {
					expect(saveWorldItem.enabled).toBeFalsy();
					(gameController as any).engine = {};
					expect(saveWorldItem.enabled).toBeTruthy();
				});

				it("saves the current story when clicked", () => {
					spyOn(gameController, "save");
					saveWorldItem.callback();
					expect(gameController.save).toHaveBeenCalled();
				});
			});

			describe("Exit", () => {
				it("has the right title", () => {
					expect(exitItem.title).toBe("Exit");
				});

				it("is always disabled", () => {
					expect(exitItem.enabled).toBeFalsy();
				});
			});
		});
	});

	describe("-> Options", () => {
		let optionsItem: MenuItem;
		let optionsMenu: Menu;
		beforeEach(() => {
			optionsItem = subject.items[1];
			optionsMenu = optionsItem.submenu;
		});

		it("is an options menu", () => {
			expect(optionsItem.title).toEqual("Options");
		});

		it("has a submenu with 9 entries", () => {
			expect(optionsMenu.items).toBeArrayOfSize(9);
		});

		describe("->", () => {
			let dificultyItem: MenuItem;
			let speedItem: MenuItem;
			let worldSizeItem: MenuItem;
			let statisticsItem: MenuItem;
			let playMusicItem: MenuItem;
			let playEffectsItem: MenuItem;
			let pauseItem: MenuItem;

			let mockedSession: UX.WindowModalSession;
			let mockWindow: any;

			beforeEach(() => {
				[
					dificultyItem,
					speedItem,
					worldSizeItem,
					statisticsItem,
					,
					playMusicItem,
					playEffectsItem,
					,
					pauseItem
				] = optionsMenu.items;

				mockedSession = ({ run: jasmine.createSpy(), end() {} } as any) as UX.WindowModalSession;
				mockWindow = document.createElement("div");
				const originalCreateElement = document.createElement;
				spyOn(document, "createElement").and.callFake((tag: string) =>
					tag.endsWith("-window") ? mockWindow : originalCreateElement(tag)
				);
				spyOn(UX, "WindowModalSession").and.returnValue(mockedSession);
			});

			afterEach(() => {
				mockWindow.onclose = null;
			});

			describe("Combat Difficulty...", () => {
				it("has the right title", () => {
					expect(dificultyItem.title).toBe("Combat Difficulty...");
				});

				describe("when clicked", () => {
					beforeEach(() => dificultyItem.callback());

					it("runs a modal session for a new DifficultyWindow", () => {
						expect(document.createElement).toHaveBeenCalledWith(DifficultyWindow.tagName);
						expect(mockedSession.run).toHaveBeenCalled();
					});
				});
			});

			describe("Game Speed...", () => {
				it("has the right title", () => {
					expect(speedItem.title).toBe("Game Speed...");
				});

				describe("when clicked", () => {
					beforeEach(() => speedItem.callback());

					it("runs a modal session for a new GameSpeedWindow", () => {
						expect(document.createElement).toHaveBeenCalledWith(GameSpeedWindow.tagName);
						expect(mockedSession.run).toHaveBeenCalled();
					});
				});
			});

			describe("World Control...", () => {
				it("has the right title", () => {
					expect(worldSizeItem.title).toBe("World Control...");
				});

				describe("when clicked", () => {
					beforeEach(() => worldSizeItem.callback());

					it("runs a modal session for a new WorldSizeWindow", () => {
						expect(document.createElement).toHaveBeenCalledWith(WorldSizeWindow.tagName);
						expect(mockedSession.run).toHaveBeenCalled();
					});
				});
			});

			describe("Statistics...", () => {
				it("has the right title", () => {
					expect(statisticsItem.title).toBe("Statistics...");
				});

				describe("when clicked", () => {
					beforeEach(() => statisticsItem.callback());

					it("runs a modal session for a new StatisticsWindow", () => {
						expect(document.createElement).toHaveBeenCalledWith(StatisticsWindow.tagName);
						expect(mockedSession.run).toHaveBeenCalled();
					});

					it("ends the session when the window is closed", () => {
						spyOn(mockedSession, "end");
						mockWindow.onclose();
						expect(mockedSession.end).toHaveBeenCalled();
					});
				});
			});

			describe("Music", () => {
				it("has the right title", () => {
					expect(playMusicItem.title).toBe("Music On");
				});

				it("is enabled if a game is in progress", () => {
					(gameController as any).engine = null;
					expect(playMusicItem.enabled).toBeFalse();

					(gameController as any).engine = {};
					expect(playMusicItem.enabled).toBeTrue();
				});

				describe("when a game is in progress", () => {
					beforeEach(() => {
						(gameController as any).engine = { mixer: { musicChannel: { muted: false } } };
					});

					it("determines it's state according to the muted property of the mixer's sound channel", () => {
						expect(playMusicItem.state).toBe(MenuItemState.On);
						gameController.engine.mixer.musicChannel.muted = true;
						expect(playMusicItem.state).toBe(MenuItemState.None);
					});

					it("toggles the mute property and updates the settings when clicked", () => {
						playMusicItem.callback();
						expect(gameController.engine.mixer.musicChannel.muted).toBeTrue();
						expect(Settings.playMusic).toBeFalse();
					});
				});

				describe("when no game is running", () => {
					beforeEach(() => {
						Settings.playMusic = true;
						(gameController as any).engine = null;
					});

					it("determines it's state according to the global settings", () => {
						Settings.playMusic = true;
						expect(playMusicItem.state).toBe(MenuItemState.On);
						Settings.playMusic = false;
						expect(playMusicItem.state).toBe(MenuItemState.None);
					});

					it("just toggles the setting when clicked", () => {
						Settings.playMusic = true;
						playMusicItem.callback();
						expect(Settings.playMusic).toBeFalse();
						playMusicItem.callback();
						expect(Settings.playMusic).toBeTrue();
					});
				});
			});

			describe("Sound", () => {
				it("has the right title", () => {
					expect(playEffectsItem.title).toBe("Sound On");
				});
			});

			describe("Pause", () => {
				it("has the right title", () => {
					expect(pauseItem.title).toBe("Pause");
				});
			});
		});
	});

	describe("-> Window", () => {
		let windowItem: MenuItem;
		let windowMenu: Menu;
		beforeEach(() => {
			windowItem = subject.items[2];
			windowMenu = windowItem.submenu;
		});

		it("is a window menu", () => {
			expect(windowItem.title).toEqual("Window");
		});

		it("has a submenu with 1 entry", () => {
			expect(windowMenu.items).toBeArrayOfSize(1);
		});
	});

	describe("-> Help", () => {
		let helpItem: MenuItem;
		let helpMenu: Menu;
		beforeEach(() => {
			helpItem = subject.items[3];
			helpMenu = helpItem.submenu;
		});

		it("is a file menu", () => {
			expect(helpItem.title).toEqual("Help");
		});

		it("has a submenu with 3 entries (and a separator)", () => {
			expect(helpMenu.items).toBeArrayOfSize(4);
		});
	});

	describe("(when debug is active)", () => {
		beforeEach(() => {
			gameController.settings.debug = true;
			subject = new MainMenu(gameController);
		});
		describe("-> Debug", () => {
			let debugItem: MenuItem;
			beforeEach(() => (debugItem = subject.items[4]));

			it("is has a debug entry", () => {
				expect(debugItem.title).toEqual("Debug");
			});
		});
	});

	describe("when debug is not active", () => {
		let debugItem: MenuItem;
		beforeEach(() => {
			gameController.settings.debug = false;
			subject = new MainMenu(gameController);
			debugItem = subject.items[4];
		});

		it("does not have a debug entry", () => {
			expect(debugItem).toBeUndefined();
		});
	});
});
