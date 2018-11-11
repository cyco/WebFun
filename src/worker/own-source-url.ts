const OwnSourceURL =
	typeof window !== "undefined" &&
	window &&
	window.document &&
	window.document.currentScript &&
	window.document.currentScript.getAttribute("src");

export default OwnSourceURL;
