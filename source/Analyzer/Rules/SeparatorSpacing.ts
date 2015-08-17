module Magic.Analyzer.Rules {
	export class SeparatorSpacing implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var previous = Frontend.Token.empty;
			tokens.forEach(t => {
				switch (previous.kind) {
					case Frontend.TokenKind.SeparatorColon:
					case Frontend.TokenKind.SeparatorLeftCurly:
					case Frontend.TokenKind.SeparatorComma:
						if (t.kind != Frontend.TokenKind.WhitespaceSpace && t.kind != Frontend.TokenKind.WhitespaceLineFeed) {
							this.addViolation(report, t, previous);
						}
						break;
					case Frontend.TokenKind.SeparatorRightParanthesis:
						if (t.kind == Frontend.TokenKind.SeparatorRightCurly) {
							this.addViolation(report, t, previous);
						}
						break;
				}
				previous = t;
			});
		}

		private addViolation(report: Report, token: Frontend.Token, previousToken: Frontend.Token) {
			report.addViolation(new Violation(token.location,
				"missing space after separator '" + previousToken.value + "'", RuleKind.Separator));
		}

	}
}
