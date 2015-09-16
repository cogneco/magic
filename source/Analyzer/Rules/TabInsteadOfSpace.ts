/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />


module Magic.Analyzer.Rules {
	// For lack of a better name...
	export class TabInsteadOfSpace implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var doCheck = false
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.WhitespaceTab:
						if (doCheck && i > 0 && tokens[i - 1].kind != Frontend.TokenKind.WhitespaceTab) {
							report.addViolation(new Violation(tokens[i].location,
								"Expected a SPACE here, but found a TAB", RuleKind.Whitespace))
						}
						break;
					case Frontend.TokenKind.WhitespaceSpace:
					case Frontend.TokenKind.WhitespaceLineFeed:
						doCheck = false
						break;
					default:
						doCheck = true
						break;
				}
			}
		}
	}
}
