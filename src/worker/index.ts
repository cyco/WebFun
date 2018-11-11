import MessageHandler from "./message-handler";

let globalMessageHandler: MessageHandler;

const source =
	window &&
	window.document &&
	window.document.currentScript &&
	window.document.currentScript.getAttribute("src");

class MyWorker {
	static ListenForMessages() {
		if (globalMessageHandler) return;
		globalMessageHandler = new MessageHandler(self);
	}

	static Spawn(): Worker {
		if (Worker) {
			return new Worker(source);
		}
	}
}

export default MyWorker;
