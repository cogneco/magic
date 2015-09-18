/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class EmptyLineAfterLeftCurly implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var linefeeds = 0
			var curlyIndex: number
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.SeparatorLeftCurly:
						var enough = false
						curlyIndex = i
						while (!enough) {
							switch (tokens[++i].kind) {
								case Frontend.TokenKind.WhitespaceLineFeed:
									linefeeds++;
									break;
								case Frontend.TokenKind.WhitespaceSpace:
								case Frontend.TokenKind.WhitespaceTab:
									break;
								default:
									enough = true;
									break;
							}
						}
						break;
					default:
						break;
				}
				// Remove the first linefeed (the one directly after '{')
				linefeeds--;
				if ((linefeeds) > 0)
					report.addViolation(new Violation(tokens[curlyIndex + 2].location,
						"found " + linefeeds + " empty line(s) after left curly", RuleKind.Whitespace));
				linefeeds = 0
			}
		}
	}
}