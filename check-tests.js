const Process = require('process');
const Path = require('path');
const FS = require('fs');

const isExcluded = (path) => {
	const basename = Path.basename(path);
	const extension = Path.extname(path);

	if (basename === 'file-format') return true;
	if (basename === 'conditions') return true;
	if (basename === 'instructions') return true;
	if (basename === 'index.js') return true;

	const stat = FS.statSync(path);
	if (stat.isDirectory()) return false;
	if (extension === '.js') return false;

	return true;
};

const concat = (acc, val = []) => acc.concat(val);

const buildTestFileName = (component) => Path.basename(component, Path.extname(component)) + '.test' + Path.extname(component);

const handleSourceEntry = (lastComponent, currentSourceRoot, currentTestRoot) => {
	const absoluteSourcePath = Path.join(currentSourceRoot, lastComponent);

	if (isExcluded(absoluteSourcePath)) return [];

	const stats = FS.statSync(absoluteSourcePath);
	const testFileName = stats.isDirectory() ? lastComponent : buildTestFileName(lastComponent);
	const absoluteTestPath = Path.join(currentTestRoot, testFileName);

	if (stats.isDirectory()) {
		return checkSourceDirectory(absoluteSourcePath, absoluteTestPath).reduce(concat, []);
	}

	return { src: absoluteSourcePath, test: absoluteTestPath };
};

const checkSourceDirectory = (currentSourceRoot, currentTestRoot) =>
	FS.readdirSync(currentSourceRoot)
	.map((lastComponent) => handleSourceEntry(lastComponent, currentSourceRoot, currentTestRoot))
	.reduce(concat, []);

const sourceRoot = Path.resolve('src');
const testRoot = Path.resolve(Path.join('test', 'unit'));

const sourceBased = checkSourceDirectory(sourceRoot, testRoot);
const testBased = checkSourceDirectory(testRoot, sourceRoot);

const formatPath = (path, from) => Path.relative(from, path).split(Path.sep).join(' > ');


let lastChoice = 'y';
const checkNextSourceFile = (callback) => {
	const file = sourceBased.pop();
	if (!file) return callback();
	if (!FS.existsSync(file.test)) {
		Process.stdout.write(`Missing test: ${formatPath(file.src, sourceRoot)} (${ formatPath(file.test, testRoot)})\n`);
		Process.stdout.write("\tDo you want to create it? ");
		Process.stdin.resume();

		Process.stdin.once("data", function(data) {
			process.stdin.pause();

			const input = data.toString().trim();
			if (input === 'y' || input === 'n') {
				lastChoice = input;
			}

			if (lastChoice === 'y') {
				try {
					try {
						FS.mkdirSync(Path.dirname(file.test));
					} catch(d) {}
					FS.writeFileSync(file.test, `describe("Missing test", () => {\n	it('must still be written', () => {\n		expect(mustBeWritten).toBe(true);\n	});\n});\n`);
					Process.stdout.write("\t- created -\n");
				} catch(e){
					Process.stdout.write(`\t- error: ${e} -\n`);
				}
			}

			checkNextSourceFile(callback);
		});
		return;
	}
	checkNextSourceFile(callback);
};

const checkNextTestFile = (callback) => {
	const file = testBased.pop();
	if (!file) return;

	if (!FS.existsSync(file.src)) {
		Process.stdout.write(`Can't find source file for test: ${formatPath(file.test, testRoot)}\n`);
		Process.stdout.write("\tDo you want to delete it? ");

		Process.stdin.resume();

		Process.stdin.once("data", function(data) {
			process.stdin.pause();

			const input = data.toString().trim();
			if (input === 'y' || input === 'n') {
				lastChoice = input;
			}

			if (lastChoice === 'y') {
				FS.unlinkSync(file.test);
				Process.stdout.write("\t- deleted -\n");
			}

			checkNextTestFile(callback);
		});
		return;
	}
	checkNextTestFile(callback);
};

checkNextSourceFile(() => {
	Process.stdout.write('––––===================================––––\n');
	lastChoice = 'n';
	checkNextTestFile(() => {})
});
