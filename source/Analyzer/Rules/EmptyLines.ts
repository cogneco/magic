/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class EmptyLines implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var linefeeds = 0
			var linefeedIndex: number
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.WhitespaceLineFeed:
						while (tokens[++i].kind == Frontend.TokenKind.WhitespaceLineFeed)
							linefeeds++
						linefeedIndex = i - 1
						break;
					default:
						break;
				}
				if (linefeeds > 1)
					report.addViolation(new Violation(tokens[linefeedIndex].location,
						"Found " + linefeeds + " empty line(s)", RuleKind.Whitespace))
				linefeeds = 0
			}
		}
	}
}