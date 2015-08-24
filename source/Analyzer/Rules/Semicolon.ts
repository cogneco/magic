/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class Semicolon implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var semicolons = 0;
			var previous = Frontend.Token.empty;
			for (var i = 0; i < tokens.length; i++) {
				if (previous.kind == Frontend.TokenKind.SeparatorSemicolon && this.isNewlineOrEof(tokens[i])) {
					report.addViolation(new Violation(previous.location,
						"a semicolon may not terminate a line", RuleKind.General));
				}
				previous = tokens[i];
			}
		}

		isNewlineOrEof(token: Frontend.Token) {
			return token.kind == Frontend.TokenKind.WhitespaceLineFeed || token.kind == Frontend.TokenKind.Eof;
		}
	}
}