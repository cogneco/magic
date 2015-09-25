/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />

// This is a hot-fix for the case where whitespace is inserted before
// the colon in a function definition.
// Example: foo : func {} // not ok
//          foo: func {} // ok

module Magic.Analyzer.Rules {
	export class SpaceBeforeSeparator implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var foundSpace = false
			var foundFunc = false
			var location: Frontend.TokenLocation
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].kind == Frontend.TokenKind.SeparatorColon) {
					if (Frontend.TokenKind[tokens[i - 1].kind].indexOf("Whitespace") > -1) {
						location = tokens[i - 1].location
						foundSpace = true
						while (i < tokens.length && !foundFunc && tokens[i].kind != Frontend.TokenKind.WhitespaceLineFeed) {
							if (tokens[i].kind == Frontend.TokenKind.KeywordFunc)
								foundFunc = true
							i++
						}
						if (foundSpace && foundFunc)
							report.addViolation(new Violation(location,
								"found whitespace before colon in function definition", RuleKind.Whitespace))
					}
				}
			}
		}
	}
}
