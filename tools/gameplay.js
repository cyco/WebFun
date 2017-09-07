import Puppeteer from "puppeteer";
import MainWindow from "./page-objects/main-window";

const GameURL = "http://localhost:8080";

function sleep(milliseconds) {
	return new Promise((r) => setTimeout(r, milliseconds));
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
		await page.evaluate("window.s.autostartEngine = false");
		await page.waitUntilGone(".loading-view");
	};
}

async function start() {
	const browser = await Puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width: 526, height: 342, deviceScaleFactor: 2 });
	await page.goto(GameURL);
	inject(page);
	return { browser, page };
}

(async () => {
	try {
		const { browser, page } = await start();
		await page.waitForSelector("wf-main-window .progress-bar");
		await page.game();

		const mainWindow = new MainWindow(page);
		mainWindow.setup();

		await page.screenshot({ path: "example.png" });
		browser.close();
	} catch (e) {
		console.log("Caught", e);
	}
})();
