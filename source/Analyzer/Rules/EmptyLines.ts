/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class EmptyLines implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var linefeeds = 0;
			var linefeedLocation: Frontend.TokenLocation;
			var foundLeftCurly = false;
			if (tokens[0].kind == Frontend.TokenKind.WhitespaceLineFeed) {
				report.addViolation(new Violation(tokens[0].location,
					"unnecessary empty line(s) at beginning of file", RuleKind.Whitespace));
			}
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.WhitespaceLineFeed:
						var enough = false;
						linefeedLocation = tokens[i + 1].location;
						while (!enough) {
							i++;
							switch (tokens[i].kind) {
								case Frontend.TokenKind.WhitespaceLineFeed:
									linefeeds++;
									break;
								case Frontend.TokenKind.WhitespaceSpace:
								case Frontend.TokenKind.WhitespaceTab:
									break;
								case Frontend.TokenKind.SeparatorRightCurly:
									foundLeftCurly = false;
								default:
									enough = true;
									break;
							}
						}
						break;
					case Frontend.TokenKind.SeparatorLeftCurly:
						foundLeftCurly = true;
						break;
					case Frontend.TokenKind.WhitespaceSpace:
					case Frontend.TokenKind.WhitespaceTab:
					case Frontend.TokenKind.LineComment:
					case Frontend.TokenKind.BlockComment:
						break;
					default:
						foundLeftCurly = false;
						break;
				}
				if (linefeeds > 0 && tokens[i].kind == Frontend.TokenKind.Eof) {
					report.addViolation(new Violation(linefeedLocation,
						"unnecessary empty line(s) before end of file", RuleKind.Whitespace));
				}
				if (linefeeds > 0 && foundLeftCurly) {
					report.addViolation(new Violation(linefeedLocation,
						"unnecessary empty line(s) after opening curly", RuleKind.Whitespace));
					foundLeftCurly = false;
				}
				if (linefeeds > 0 && tokens[i].kind == Frontend.TokenKind.SeparatorRightCurly) {
					report.addViolation(new Violation(linefeedLocation,
						"unnecessary empty line(s) before closing curly", RuleKind.Whitespace));
				}
				if (linefeeds > 1) {
					report.addViolation(new Violation(linefeedLocation,
						"too many empty lines: " + linefeeds, RuleKind.Whitespace));
				}
				linefeeds = 0;
			}
		}
	}
}