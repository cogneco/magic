///<reference path="./../typings/node/node.d.ts" />
///<reference path="./Analyzer/Analyzer" />
///<reference path="./Analyzer/Rules/Indentation" />
///<reference path="./Analyzer/Rules/EmptyLineAfterLeftCurly" />
///<reference path="./Analyzer/Rules/EmptyLineBeforeRightCurly" />
///<reference path="./Analyzer/Rules/EmptyLineBeforeEof" />
///<reference path="./Analyzer/Rules/WhitespaceAtBeginningOfFile" />
///<reference path="./Analyzer/Rules/EmptyLines" />
///<reference path="./Analyzer/Rules/ExcessiveSpace" />
///<reference path="./Analyzer/Rules/KeywordSpacing" />
///<reference path="./Analyzer/Rules/OperatorSpacing" />
///<reference path="./Analyzer/Rules/SeparatorSpacing" />
///<reference path="./Analyzer/Rules/RedundantTypeInfo" />
///<reference path="./Analyzer/Rules/Func" />
///<reference path="./Analyzer/Rules/ThisUsage" />
///<reference path="./Analyzer/Rules/Semicolon" />
///<reference path="./Analyzer/Rules/TabInsteadOfSpace" />
///<reference path="./Analyzer/Rules/SpaceBeforeSeparator" />
///<reference path="./Frontend/Glossary" />
///<reference path="./Utilities/String" />

var fs = require("fs");

module Magic {
	export class MagicEntry {
		private static version = "0.1.23-alpha";
		private arguments: string[];
		private sortByLineNumber = false
		constructor(command: string[]) {
			command = command.slice(2);
			if (command.length == 0) {
				command[0] = ".";
			}
			if (command[0] == "-s") {
				this.sortByLineNumber = true
				command = command.slice(1)
			}

			this.arguments = command;
		}

		analyze(): boolean {
			var rules = [
				new Magic.Analyzer.Rules.Indentation(),
				new Magic.Analyzer.Rules.EmptyLineAfterLeftCurly(),
				new Magic.Analyzer.Rules.EmptyLineBeforeRightCurly(),
				new Magic.Analyzer.Rules.EmptyLineBeforeEof(),
				new Magic.Analyzer.Rules.WhitespaceAtBeginningOfFile(),
				new Magic.Analyzer.Rules.EmptyLines(),
				new Magic.Analyzer.Rules.ExcessiveSpace(),
				new Magic.Analyzer.Rules.KeywordSpacing(),
				new Magic.Analyzer.Rules.OperatorSpacing(),
				new Magic.Analyzer.Rules.SeparatorSpacing(),
				new Magic.Analyzer.Rules.RedundantTypeInfo(),
				new Magic.Analyzer.Rules.Func(),
				new Magic.Analyzer.Rules.ThisUsage(),
				new Magic.Analyzer.Rules.Semicolon(),
				new Magic.Analyzer.Rules.TabInsteadOfSpace(),
				new Magic.Analyzer.Rules.SpaceBeforeSeparator()
			];
			var success = true;
			var analyzer = new Magic.Analyzer.Analyzer(new Frontend.Glossary(), rules);
			var analyzerResult = analyzer.analyze(this.arguments)
			analyzerResult.forEach(report => {
				if (report.violations.length > 0) {
					success = false
					var file = report.violations[0].location.filename;
					var violations = report.violations
					console.log("\033[1m\033[4m\n" + file + "\033[0m");
					if (this.sortByLineNumber) {
						violations = violations.sort((a, b) => {
							return a.location.line - b.location.line
						})
					}
					violations.forEach(v => {
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
