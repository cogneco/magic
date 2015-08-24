/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class LineLength implements Rule {
		constructor(private maxLineLength: number) { }
		run(tokens: Frontend.Token[], report: Report) {
			tokens.forEach(t => {
				if (t.kind == Frontend.TokenKind.WhitespaceLineFeed) {
					if (t.location.column > this.maxLineLength) {
						var length = t.location.column;
						var message = "line length warning: " + length + " characters!";
						report.addViolation(new Violation(t.location, message, RuleKind.General));
					}
				}
			});
		}
	}
}