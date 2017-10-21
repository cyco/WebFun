import "babel-polyfill";
import Fs from "fs";
import Path from "path";
import Puppeteer from "puppeteer";
import MainWindow from "./page-objects/main-window";
import Menu from "./page-objects/menu";

const ScreenShotDirectory = Path.resolve("test/screenshots/");
const GameURL = "http://localhost:8080";

function sleep(milliseconds) {
	return new Promise((r) => setTimeout(r, milliseconds));
}

const deleteFolderRecursive = function (path) {
	if (Fs.existsSync(path)) {
		Fs.readdirSync(path).forEach(function (file, index) {
			const curPath = path + "/" + file;
			if (Fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				Fs.unlinkSync(curPath);
			}
		});
		Fs.rmdirSync(path);
	}
};

let screenshotIdx = 1;

async function TakeScreenshot(page, name) {
	if (!page) return;

	await page.screenshot({path: Path.resolve(ScreenShotDirectory, (screenshotIdx++) + "_" + name + ".png")});
}

let recordIndex = 1;

async function record(page, frames) {
	return new Promise(async (resolve, reject) => {
		await page.exposeFunction("onMetronomeTick", async () => {
			await TakeScreenshot(page, "recording_" + (++recordIndex));
			if (recordIndex === frames) {
				resolve();
				await page.evaluate(() => window.onMetronomeTick = null);
			}
		});
	});
}

async function inject(page) {
	page.waitUntilGone = async (selector, options = {}) => {
		try {
			options.timeout = 300;
			await page.waitForSelector(selector, options);
			await page.waitUntilGone(selector, options);
		} catch (e) {
			return true;
		}
	};

	page.game = async () => {
		await page.waitForSelector(".progress-bar[data-value=\"1\"]");

		await sleep(2300); // wait through fade out
		await TakeScreenshot(page, "after loading");
	};
}

async function start() {
	const browser = await Puppeteer.launch({headless: true, omitBackground: true});
	const page = await browser.newPage();
	await page.setViewport({width: 526, height: 342, deviceScaleFactor: 2});
	await page.goto(GameURL);
	inject(page);
	return {browser, page};
}

(async () => {
	let page, browser;
	try {
		try {
			deleteFolderRecursive(ScreenShotDirectory);
			Fs.mkdirSync(ScreenShotDirectory);
		} catch (e) {
		}
		const r = await start();
		page = r.page;
		browser = r.browser;

		page.on("pageerror", (msg) => {
			console.log("Page: ", msg);
			TakeScreenshot(page, "page error");
		});

		await page.evaluate(() => localStorage.clear());

		await page.waitForSelector("wf-main-window .progress-bar");
		await page.game();
		const mainWindow = new MainWindow(page);
		await mainWindow.setup();

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		/* start new game                                              */
		const fileMenuItem = mainWindow.menubar.itemWithTitle("File");
		await fileMenuItem.click();
		await TakeScreenshot(page, "opened file menu");

		const fileMenu = new Menu(mainWindow);
		await fileMenu.setup();
		const newStoryItem = fileMenu.itemWithTitle("New World");
		await newStoryItem.hover();
		await TakeScreenshot(page, "on new world item");
		await newStoryItem.click();
		await TakeScreenshot(page, "clicked new world item");
		await record(page, 120);
		await TakeScreenshot(page, "running game");

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		await TakeScreenshot(page, "end");
		browser.close();
	} catch (e) {
		await TakeScreenshot(page, "error");
		console.log("Caught", e);
	}
})();
