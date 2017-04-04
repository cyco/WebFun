import EventTarget from './event-target';

export const Event = {
    Start: 'start',
    Progress: 'progress',
    Finish: 'finish',
    Error: 'error'
};

export default class BatchOperation extends EventTarget {
    start() {}

    cancel() {}
	
	static get Event() { return Event; }
}