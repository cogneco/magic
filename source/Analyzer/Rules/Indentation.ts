/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class Indentation implements Rule {
		private level = 1;
		run(tokens: Frontend.Token[], report: Report) {
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.KeywordClass:
					case Frontend.TokenKind.KeywordCover:
					//case Frontend.TokenKind.KeywordFunc:
						if (i > 2 && tokens[i - 2].kind != Frontend.TokenKind.SeparatorColon) {
							continue;
						}
						while (tokens[++i].kind != Frontend.TokenKind.SeparatorLeftCurly && tokens[i].kind != Frontend.TokenKind.KeywordFrom);
						if (tokens[i].kind != Frontend.TokenKind.KeywordFrom) {
							i = this.scanClassBody(tokens, i + 1, report);
						}
						break;
				}
			}
		}
		private scanClassBody(tokens: Frontend.Token[], index: number, report: Report) {
			var curlyDelta = 1;
			var tabCount = 0;
			var previousTabCount = 0;
			while (curlyDelta > 0 && tokens[index].kind != Frontend.TokenKind.Eof) {
				switch (tokens[index].kind) {
					case Frontend.TokenKind.SeparatorLeftCurly:
						this.level++;
						curlyDelta++;
						break;
					case Frontend.TokenKind.SeparatorRightCurly:
						this.level--;
						curlyDelta--;
						break;
					case Frontend.TokenKind.WhitespaceSpace:
						if (index > 0 && tokens[index - 1].kind == Frontend.TokenKind.WhitespaceLineFeed) {
							report.addViolation(new Violation(tokens[index].location,
								"Expected a TAB, found a SPACE", RuleKind.Whitespace));
						}
						break;
					case Frontend.TokenKind.WhitespaceTab:
						if (index > 0 && tokens[index - 1].kind != Frontend.TokenKind.WhitespaceTab) {
							// If there is a TAB instead of a SPACE somewhere, we'll abort the check on this line.
							// This case should be covered by another rule.
							break;
						}
						while (tokens[index].kind == Frontend.TokenKind.WhitespaceTab) {
							tabCount++;
							index++;
						}
						if (tabCount > previousTabCount && tabCount - previousTabCount > 1) {
							report.addViolation(new Violation(tokens[index].location,
								"Incorrect indentation, expected " + (previousTabCount + 1) + " but found " + tabCount, RuleKind.Whitespace))
						}
						previousTabCount = tabCount;
						index--
						break;
					//case Frontend.TokenKind.KeywordClass:
					default:
						tabCount = 0
						break;
				}
				index++;
			}
			if (curlyDelta !== 0) {
				throw Error("[Indentation] -> Expected separator delta to be zero here: '" + curlyDelta + "'" +
					"\n\tLocation: " + tokens[index].location.toString() + " in " + tokens[index].location.filename)
			}
			return index + 1;
		}
	}
}