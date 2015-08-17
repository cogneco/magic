module Magic.Analyzer.Rules {
	export class KeywordSpacing implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var previous = Frontend.Token.empty;
			for (var i = 0; i < tokens.length; i++) {
				if (Frontend.TokenKind[tokens[i].kind].indexOf("Keyword") < 0) {
					continue;
				}
				switch (tokens[i].kind) {
					case Frontend.TokenKind.KeywordUse:
					case Frontend.TokenKind.KeywordImport:
					case Frontend.TokenKind.KeywordNew:
						break;
					case Frontend.TokenKind.KeywordGet:
					case Frontend.TokenKind.KeywordSet:
						break;
					default:
						// left | tokens[i] | right
						var left = previous;
						var right = tokens[i + 1] == undefined ? Frontend.Token.empty : tokens[i + 1];
						if (right.kind == Frontend.TokenKind.OperatorDereference || right.kind == Frontend.TokenKind.SeparatorComma) {
							continue;
						}
						if (left.kind == Frontend.TokenKind.OperatorLessThan && right.kind == Frontend.TokenKind.OperatorGreaterThan) {
							continue;
						}
						if (left.kind == Frontend.TokenKind.SeparatorLeftParanthesis || right.kind == Frontend.TokenKind.SeparatorRightParanthesis) {
							continue;
						}
						if (right.kind == Frontend.TokenKind.SeparatorLeftBracket || right.kind == Frontend.TokenKind.SeparatorRightBracket) {
							continue;
						}
						switch (right.kind) {
							case Frontend.TokenKind.WhitespaceSpace:
							case Frontend.TokenKind.WhitespaceTab:
							case Frontend.TokenKind.WhitespaceLineFeed:
							case Frontend.TokenKind.OperatorLessThan: // Allow This<T> etc.
							case Frontend.TokenKind.OperatorGreaterThan: // Allow This<T> etc.
							case Frontend.TokenKind.OperatorConditional: // Allow in? etc.
								break;
							default:
								report.addViolation(new Violation(right.location,
									"missing space after keyword '" + tokens[i].value + "'", RuleKind.Keyword));
								break;
						}
						break;

				}
				previous = tokens[i];
			}
		}
	}
}