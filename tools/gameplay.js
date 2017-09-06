const GameURL = "http://localhost:8080";

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width: 526, height: 342 });
	await page.goto(GameURL);
	await page.waitForSelector("wf-main-window .progress-bar");
	await page.screenshot({ path: "example.png" });

	browser.close();
})();
