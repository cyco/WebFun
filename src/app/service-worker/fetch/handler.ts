interface Handler {
	readonly cacheName: string;
	shouldHandle(url: URL): boolean;
	handle(request: Request): Promise<Response>;
}

export default Handler;
