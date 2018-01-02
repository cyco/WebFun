import { ModalConfirm, WindowModalSession } from 'src/ux';
import { Window } from 'src/ui/components';
import DataManager from 'src/editor/data-manager';
import { SimulatorWizard } from './components';

class Simulator {
	private _data: DataManager;

	async start() {
		const wizard = <SimulatorWizard>document.createElement(SimulatorWizard.TagName);
		wizard.data = this.data;

		if (!await ModalConfirm(wizard, { confirmText: 'Simulate', abortText: 'Cancel' })) {
			return;
		}
	}

	set data(d) {
		this._data = d;
	}

	get data() {
		return this._data;
	}
}

export default Simulator;
