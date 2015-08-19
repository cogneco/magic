/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class Indentation implements Rule {
		private level = 1;
		run(tokens: Frontend.Token[], report: Report) {
			console.log(tokens[0].location.filename);
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.KeywordClass:
					case Frontend.TokenKind.KeywordCover:
						while (tokens[++i].kind != Frontend.TokenKind.SeparatorLeftCurly && tokens[i].kind != Frontend.TokenKind.KeywordFrom);
						if (tokens[i].kind != Frontend.TokenKind.KeywordFrom) {
							i = this.scanClassBody(tokens, i + 1, report);
						}
						break;
				}
			}
		}
		private scanClassBody(tokens: Frontend.Token[], index: number, report: Report) {
			var delta = 1;
			var tabs = 0;
			var nextIsSingleLine: boolean;
			while (delta > 0 && tokens[index].kind != Frontend.TokenKind.Eof) {
				switch (tokens[index].kind) {
					case Frontend.TokenKind.SeparatorLeftCurly:
						this.level++;
						delta++;
						break;
					case Frontend.TokenKind.SeparatorRightCurly:
						this.level--;
						delta--;
						break;
					case Frontend.TokenKind.KeywordIf:
					case Frontend.TokenKind.KeywordFrom:
					case Frontend.TokenKind.KeywordWhile:
						break;
						// FALL-THROUGH
					case Frontend.TokenKind.WhitespaceLineFeed:
						var correctedLevel: number;
						while (tokens[++index].kind == Frontend.TokenKind.WhitespaceTab) {
							tabs++;
						}
						if (Frontend.TokenKind[tokens[index].kind].indexOf("Whitespace") < 0) {
							correctedLevel = this.level - (tokens[index].kind == Frontend.TokenKind.SeparatorRightCurly ? 1 : 0);
							if (correctedLevel != tabs) {
								report.addViolation(new Violation(tokens[index].location,
									"incorrect indentation, expected " + correctedLevel + " tabs, but found " + tabs, RuleKind.General));
							}
							tabs = 0;
						}
						index--;
						break;
				}
				index++;
			}
			if (delta !== 0) {
				throw Error("[Indentation] -> Expected separator delta to be zero here: '" + delta + "'");
			}
			return index + 1;
		}
	}
}