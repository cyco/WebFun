const Path = require("path");
const FS = require("fs");

/* configuration */
const source = Path.resolve("../src");
const test = Path.resolve("../test/unit");

/* prototype extensions */
const flatten = function() {
	return Array.prototype.concat.apply([], this);
};

Array.prototype.flatten = Array.prototype.flatten || flatten;

/* */
const isExcluded = (file, isDirectory) => {
	return (
		file === ".DS_Store" ||
		file === "index.ts" ||
		file === "index.js" ||
		(!isDirectory && !file.endsWith(".js") && !file.endsWith(".ts")) ||
		(isDirectory && file === "debug") ||
		(isDirectory && file === "editor") ||
		(isDirectory && file === "@types") ||
		(isDirectory && file === "npc-move") ||
		(isDirectory && file === "save-game-editor")
	);
};

const testFileNames = source => {
	const fileName = Path.basename(source, Path.extname(source));

	return [fileName + ".test.ts", fileName + ".test.js"];
};

const isDir = path => {
	try {
		const stats = FS.statSync(path);
		return stats.isDirectory();
	} catch (e) {
		return false;
	}
};

const scan = (source, test) =>
	FS.readdirSync(source)
		.map(file => {
			const sourcePath = Path.join(source, file);
			if (isDir(sourcePath)) {
				if (isExcluded(file, true)) return [];
				return scan(sourcePath, Path.join(test, file)).flatten();
			} else {
				if (isExcluded(file, false)) return [];
				const testNames = testFileNames(file);
				const testPaths = testNames.map(name => Path.join(test, name));
				if (testPaths.some(path => FS.existsSync(path))) {
					return [];
				}

				return {
					fullPath: sourcePath,
					source: source,
					test: test,
					name: file
				};
			}
		})
		.filter(s => s)
		.flatten();

const isTestExcluded = (path, isDirectory) => false;

const scanTests = (test, source) =>
	FS.readdirSync(test)
		.map(file => {
			const testPath = Path.join(test, file);
			if (isDir(testPath)) {
				if (isTestExcluded(file, true)) return [];
				return scanTests(testPath, Path.join(source, file)).flatten();
			} else {
				if (isTestExcluded(file, false)) return [];
				const sourceNames = [
					file.split(".test.ts")[0] + ".ts",
					file.split(".test.js")[0] + ".ts",
					file.split(".test.js")[0] + ".tsx",
					file.split(".test.js")[0] + ".js",
					file.split(".test.ts")[0] + ".tsx",
					file.split(".test.ts")[0] + ".js"
				];

				const sourcePaths = sourceNames.map(name => Path.join(source, name));
				if (sourcePaths.some(path => FS.existsSync(path))) {
					return [];
				}

				return {
					fullPath: testPath,
					test: test,
					name: file,
					placeholder: FS.readFileSync(testPath, "utf8").includes(
						'xdescribe("Missing test", () => {'
					)
				};
			}
		})
		.filter(s => s)
		.flatten();

const main = (...arguments) => {
	const dryRun = arguments.pop() !== "no-dry-run";
	if (dryRun) {
		console.log("Dry run. Pass no-dry-run argument to actually create test files.");
	}

	scan(source, test).forEach(({ test, name }) => {
		const fullPath = Path.join(test, testFileNames(name)[0]);
		console.log("CREATE ", fullPath);
		if (!dryRun) {
			try {
				FS.mkdirSync(test);
			} catch (e) {}

			try {
				FS.writeFileSync(
					fullPath,
					`xdescribe("Missing test", () => {
	it("must still be written", () => {});
});
`
				);
			} catch (e) {
				console.log("Test could not be created.");
			}
		}
	});

	scanTests(test, source).forEach(({ fullPath, placeholder }) => {
		if (placeholder) {
			console.log("DELETE ", fullPath);
			if (!dryRun) {
				try {
					FS.unlinkSync(fullPath);
				} catch (e) {}
			}
		} else {
			console.log("CHECK ", fullPath);
		}
	});
};

main(...process.argv);
