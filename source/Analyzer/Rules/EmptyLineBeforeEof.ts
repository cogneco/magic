/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class EmptyLineBeforeEof implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var linefeeds = 0
			var linefeedIndex: number
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.Eof:
						var k = i
						var foundLinefeed = false
						while (k > 0 && !foundLinefeed) {
							switch(tokens[--k].kind) {
								case Frontend.TokenKind.WhitespaceLineFeed:
									linefeeds++
									break;
								case Frontend.TokenKind.WhitespaceTab:
								case Frontend.TokenKind.WhitespaceSpace:
									break;
								default:
									foundLinefeed = true;
									break;
							}
						}
						linefeeds--
						if (linefeeds < 0) {
							report.addViolation(new Violation(tokens[i].location,
									"missing empty line before end of file", RuleKind.Whitespace));
						}
						else if (linefeeds > 0)
							report.addViolation(new Violation(tokens[i - 1].location,
								"found " + linefeeds + " extra empty line(s) before end of file (keep one empty)", RuleKind.Whitespace));
						break;
					default:
						break;
				}
				linefeeds = 0
			}
		}
	}
}