declare module "detect-mobile-browser" {
	interface SmartPhone {
		isAndroid(): boolean;
		isBlackBerry(): boolean;
		isBlackBerryPlayBook(): boolean;
		isBlackBerry10(): boolean;
		isIOS(): boolean;
		isIPhone(): boolean;
		isIPad(): boolean;
		isIPod(): boolean;
		isOpera(): boolean;
		isWindows(): boolean;
		isWindowsMobile(): boolean;
		isWindowsDesktop(): boolean;
		isFireFox(): boolean;
		isNexus(): boolean;
		isKindleFire(): boolean;
		isPalm(): boolean;
		isAny(): boolean;
	}

	const SmartPhoneConstructor: (_: boolean) => SmartPhone;
	export = SmartPhoneConstructor;
}
