///<reference path="./../typings/node/node.d.ts" />
var fs = require("fs");

module Magic {
	export class MagicEntry {
		private static version = "0.1.9-alpha";
		private arguments: string[];

		constructor(command: string[]) {
			command = command.slice(2);
			if (command.length == 0) {
				command[0] = ".";
			}
			this.arguments = command;
		}

		analyze() {
			var rules = [
				/*new Magic.Analyzer.Rules.Indentation(),*/
				new Magic.Analyzer.Rules.EmptyLines(),
				new Magic.Analyzer.Rules.ExcessiveSpace(),
				new Magic.Analyzer.Rules.KeywordSpacing(),
				new Magic.Analyzer.Rules.OperatorSpacing(),
				new Magic.Analyzer.Rules.SeparatorSpacing(),
				new Magic.Analyzer.Rules.RedundantTypeInfo(),
				new Magic.Analyzer.Rules.Func(),
				new Magic.Analyzer.Rules.ThisUsage(),
				new Magic.Analyzer.Rules.Semicolon()
			];
			var analyzer = new Magic.Analyzer.Analyzer(new Frontend.Glossary(), rules);
			analyzer.analyze(this.arguments).forEach(report => {
				if (report.violations.length > 0) {
					var file = report.violations[0].location.filename;
					console.log("\n" + file);
					console.log(Utilities.String.padRight("", "-", file.length));
					report.violations.forEach(v => {
						console.log(Utilities.String.padRight(v.location.toString(), ".", 14) + v.message);
					});
				}
			});
		}

		static printVersion() {
			console.log("\n-> magic " + MagicEntry.version);
		}
	}
}

try {
	var magic = new Magic.MagicEntry(process.argv);
	magic.analyze()
	Magic.MagicEntry.printVersion();
} catch (Error) {
	console.log(Error.toString());
}
