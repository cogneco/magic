/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class ThisUsage implements Rule {
		private classMembers: string[] = [];
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var className: string;
			var isClass = false;
			var isCoverFrom = false;
			var isExternCover = false;
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].kind == Frontend.TokenKind.Identifier) {
					className = tokens[i].value;
					while (tokens[i].kind != Frontend.TokenKind.WhitespaceLineFeed && tokens[i].kind != Frontend.TokenKind.Eof) {
						if (tokens[i].kind == Frontend.TokenKind.KeywordClass || tokens[i].kind == Frontend.TokenKind.KeywordCover) {
							while (tokens[i].kind != Frontend.TokenKind.SeparatorLeftCurly) {
								if (tokens[i].kind == Frontend.TokenKind.KeywordFrom) {
									isCoverFrom = true;
									i++;
									break;
								} else if (tokens[i - 1].kind == Frontend.TokenKind.KeywordExtern) {
									isExternCover = true;
									i++;
									break;
								}
								i++;
							}
							isClass = !isCoverFrom
							break;
						}
						i++;
					}
					if (isClass && !isCoverFrom && !isExternCover) {
						i = this.analyzeClassBody(tokens, report, i, className);
						isClass = false;
					}
				}
				isCoverFrom = false;
			}
			//this.classMembers = this.getClassMembers(tokens);
		}

		getClassMembers(tokens: Frontend.Token[]) {
			var members: string[] = [];
			var previous = Frontend.Token.empty;
			for (var i = 0; i < tokens.length; i++) {
				if (previous.kind == Frontend.TokenKind.Identifier && tokens[i].kind == Frontend.TokenKind.SeparatorColon) {
					i++;
					while (Frontend.TokenKind[tokens[i].kind].indexOf("Whitespace") > -1) {
						i++;
					}
					switch (tokens[i].kind) {
						case Frontend.TokenKind.KeywordClass:
						case Frontend.TokenKind.KeywordCover:
							break;
						case Frontend.TokenKind.KeywordStatic:
							break;
						case Frontend.TokenKind.KeywordFunc:
							while (tokens[i].kind != Frontend.TokenKind.SeparatorLeftCurly && tokens[i].kind != Frontend.TokenKind.WhitespaceLineFeed) {
								i++;
							}
							break;
						case Frontend.TokenKind.Identifier:
							break;
						default:
							break;
					}
				}
				previous = tokens[i];
			}

			return members;
		}

		analyzeClassBody(tokens: Frontend.Token[], report: Report, index: number, name: string) {
			var delta = 1;
			index++;
			while (delta > 0 && tokens[index].kind != Frontend.TokenKind.Eof && tokens[index].kind != Frontend.TokenKind.KeywordFrom) {
				switch (tokens[index].kind) {
					case Frontend.TokenKind.SeparatorLeftCurly:
						delta++;
						break;
					case Frontend.TokenKind.SeparatorRightCurly:
						delta--;
						break;
					case Frontend.TokenKind.Identifier:
						if (tokens[index].value === name) {
							if (tokens[index - 1].kind == Frontend.TokenKind.WhitespaceSpace && tokens[index - 2].kind == Frontend.TokenKind.Identifier) {
								var character = tokens[index - 2].value.charAt(0)
								if (character == character.toUpperCase()) {
									break;
								}
							}
							report.addViolation(new Violation(tokens[index].location,
								"replace '" + name + "' with 'This'", RuleKind.General));
						}
						break;
					default:
						break;
				}
				index++;
			}
			return index;
		}

	}
}
