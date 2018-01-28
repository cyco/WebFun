import KaitaiCompiler from "kaitai-struct-compiler";
import YAML from "js-yaml";
import Path from "path";
import FS from "fs";
import Shell, { ShellString } from "shelljs";

const execWithInput = (command, input) => new ShellString(input, null, null).exec(command, { silent: true });

const dot2format = (graph, format) => {
	if (!Shell.which("dot")) {
		Shell.echo("Sorry, this script requires dot");
		Shell.exit(1);
	}

	return execWithInput(`dot -T${format}`, graph).stdout;
};

const dot2svg = graph => dot2format(graph, "svg");

const inputFilePath = Path.join(__dirname, "..", "src", "engine", "file-format", "yodesk.ksy");
const inputFile = FS.readFileSync(inputFilePath);
const inputStructure = YAML.safeLoad(inputFile);

const compiler = new KaitaiCompiler();
compiler.compile("graphviz", inputStructure, null, false).then(graphs => {
	const svg = dot2svg(Object.values(graphs).join("\n"));
	process.stdout.write(svg);
});
