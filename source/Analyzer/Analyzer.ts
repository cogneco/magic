///<reference path="../../typings/node/node.d.ts" />
///<reference path="./Report" />
var fs = require("fs");

//
// TODO: The analyzer should not work with a list of tokens, it should work with a parse tree.
//
module Magic.Analyzer {
	export class Analyzer {
		private ignoreFile = ".magicignore";
		private targetBaseFolder: string;
		private ignoreFiles: string[] = [];

		constructor(private glossary: Frontend.Glossary, private rules: Rules.Rule[]) { }

		analyze(targets: string[]): Report[] {
			var reports: Report[] = [];
			targets.forEach(t => {
				if (fs.existsSync(t)) {
					if (fs.lstatSync(t).isDirectory()) {
						reports = reports.concat(this.analyzeFolder(t));
					} else {
						reports.push(this.analyzeFile(fs.realpathSync(t)));
					}
				} else {
					console.log("-> File/folder '" + t + "' does not exist");
				}
			});
			return reports;
		}

		private analyzeFolder(folder: string) {
			var reports: Report[] = [];
			if (folder.charAt(folder.length - 1) === "/") {
				folder = folder.slice(0, folder.length - 1);
			}
			this.targetBaseFolder = folder;
			this.readIgnoreFile(folder + "/" + this.ignoreFile);
			Utilities.Filesystem.getFiles(folder, ".ooc", this.ignoreFiles).forEach(file => {
				reports.push(this.analyzeFile(fs.realpathSync(file)));
			});
			return reports;
		}

		private analyzeFile(file: string) {
			var report = new Report();
			var tokens = new Frontend.Lexer(file, this.glossary).getTokenList();
			this.rules.forEach(rule => {
				rule.run(tokens, report);
			});
			return report;
		}

		private readIgnoreFile(file: string) {
			if (fs.existsSync(file)) {
				fs.readFileSync(file, "utf-8").split("\n").filter(f => {
					return f.length > 0;
				}).forEach(file => {
					if (file.charAt(file.length - 1) === "/") {
						file = file.slice(0, file.length - 1);
					}
					if (file.charAt(0) === "/") {
						file = file.slice(1);
					}
					this.ignoreFiles.push(this.targetBaseFolder + "/" + file);
				});
			}
		}

	}
}