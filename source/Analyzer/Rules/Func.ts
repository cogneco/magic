/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />
/// <reference path="../Violation" />
/// <reference path="../RuleKind" />

module Magic.Analyzer.Rules {
	export class Func implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.KeywordFunc:
						i++;
						if (tokens[i].kind == Frontend.TokenKind.WhitespaceLineFeed) {
							break;
						}
						var canExit = false;
						var insideBlock = false;
						while (!canExit && tokens[i].kind != Frontend.TokenKind.Eof) {
							switch (tokens[i].kind) {
								case Frontend.TokenKind.SeparatorLeftParanthesis:
									if (!insideBlock && tokens[i - 2].kind == Frontend.TokenKind.OperatorNegate && tokens[i - 1].kind == Frontend.TokenKind.Identifier) {
										report.addViolation(new Violation(tokens[i].location,
											"missing space between func identifier and parenthesis",
											RuleKind.General));
									}
									i = this.checkBody(tokens, i + 1, report,
										Frontend.TokenKind.SeparatorLeftParanthesis, Frontend.TokenKind.SeparatorRightParanthesis,
										"unnecessary parentheses [empty argument list]");
									if (tokens[i].kind == Frontend.TokenKind.WhitespaceLineFeed) {
										canExit = true;
									}
									break;
								case Frontend.TokenKind.SeparatorLeftCurly:
									insideBlock = true;
									i = this.checkBody(tokens, i + 1, report,
										Frontend.TokenKind.SeparatorLeftCurly, Frontend.TokenKind.SeparatorRightCurly,
										"unnecessary curly brackets [empty function body]");
									canExit = true;
									break;
								default:
									i++;
									break;
							}
						}
						break;
					default:
						break;
				}
			}
		}

		checkBody(tokens: Frontend.Token[], index: number, report: Report, openingKind: Frontend.TokenKind, closingKind: Frontend.TokenKind, message: string) {
			var delta = 1;
			var emptyBody = true;
			var startLocation = tokens[index - 1].location;
			while (delta > 0 && tokens[index].kind != Frontend.TokenKind.Eof) {
				switch (tokens[index].kind) {
					case Frontend.TokenKind.WhitespaceLineFeed:
					case Frontend.TokenKind.WhitespaceSpace:
					case Frontend.TokenKind.WhitespaceTab:
						break;
					case openingKind:
						delta++;
						break;
					case closingKind:
						delta--;
						break;
					default:
						emptyBody = false;
						break;
				}
				index++;
			}
			if (emptyBody) {
				report.addViolation(new Violation(startLocation, message, RuleKind.General));
			}
			return index;
		}
	}
}