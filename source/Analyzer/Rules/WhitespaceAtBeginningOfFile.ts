/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class WhitespaceAtBeginningOfFile implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			switch (tokens[0].kind) {
				case Frontend.TokenKind.WhitespaceLineFeed:
				case Frontend.TokenKind.WhitespaceSpace:
				case Frontend.TokenKind.WhitespaceTab:
					report.addViolation(new Violation(tokens[0].location,
						"Whitespace may not start a file", RuleKind.Whitespace));
					break;
			}
		}
	}
}