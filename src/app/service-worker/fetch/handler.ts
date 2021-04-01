interface Handler {
	readonly cacheName: string;
	shouldHandle(request: Request): boolean;
	handle(request: Request): Promise<Response>;
}

export default Handler;
