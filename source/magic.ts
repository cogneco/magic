///<reference path="./../typings/node/node.d.ts" />
var fs = require("fs");

module Magic {
	export class MagicEntry {
		private static version = "0.1.14-alpha";
		private arguments: string[];

		constructor(command: string[]) {
			command = command.slice(2);
			if (command.length == 0) {
				command[0] = ".";
			}
			this.arguments = command;
		}

		analyze(): boolean {
			var rules = [
				new Magic.Analyzer.Rules.Indentation(),
				new Magic.Analyzer.Rules.EmptyLineAfterLeftCurly(),
				new Magic.Analyzer.Rules.EmptyLineBeforeRightCurly(),
				new Magic.Analyzer.Rules.ExcessiveSpace(),
				new Magic.Analyzer.Rules.KeywordSpacing(),
				new Magic.Analyzer.Rules.OperatorSpacing(),
				new Magic.Analyzer.Rules.SeparatorSpacing(),
				new Magic.Analyzer.Rules.RedundantTypeInfo(),
				new Magic.Analyzer.Rules.Func(),
				new Magic.Analyzer.Rules.ThisUsage(),
				new Magic.Analyzer.Rules.Semicolon(),
				new Magic.Analyzer.Rules.TabInsteadOfSpace()
			];
			var success = true;
			var analyzer = new Magic.Analyzer.Analyzer(new Frontend.Glossary(), rules);
			analyzer.analyze(this.arguments).forEach(report => {
				if (report.violations.length > 0) {
					success = false
					var file = report.violations[0].location.filename;
					console.log("\033[1m\033[4m\n" + file + "\033[0m");
					report.violations.forEach(v => {
						console.log(Utilities.String.padRight(v.location.toString(), ".", 14) + v.message);
					});
				}
			});
			return success;
		}

		static printVersion() {
			console.log("\033[7m\n-> magic " + MagicEntry.version + "\033[0m");
		}
	}
}

try {
	var magic = new Magic.MagicEntry(process.argv);
	var success = magic.analyze()
	Magic.MagicEntry.printVersion();
	process.exit(success ? 0 : 1)
} catch (Error) {
	console.log(Error.toString());
}
