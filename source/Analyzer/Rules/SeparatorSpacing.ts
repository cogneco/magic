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
					case Frontend.TokenKind.SeparatorRightParanthesis:
						if (t.kind == Frontend.TokenKind.WhitespaceTab) {
							this.addViolation("found a TAB instead of a SPACE after separator", report, t, previous);
						} else {
							var message = "missing space after separator";
							if (previous.kind == Frontend.TokenKind.SeparatorRightParanthesis) {
								if (t.kind == Frontend.TokenKind.SeparatorRightCurly) {
									this.addViolation(message, report, t, previous);
								}
							} else {
								if (t.kind != Frontend.TokenKind.WhitespaceSpace && t.kind != Frontend.TokenKind.WhitespaceLineFeed) {
									this.addViolation(message, report, t, previous);
								}
							}
						}
						break;
				}
				previous = t;
			});
		}

		private addViolation(message: string, report: Report, token: Frontend.Token, previousToken: Frontend.Token) {
			report.addViolation(new Violation(token.location,
				message + " '" + previousToken.value + "'", RuleKind.Separator));
		}

	}
}
