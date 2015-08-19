/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class ExcessiveSpace implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var spaces = 0;
			var spaceLocation: Frontend.TokenLocation;
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.WhitespaceSpace:
						spaceLocation = tokens[i].location;
						i++;
						if (tokens[i].kind == Frontend.TokenKind.WhitespaceLineFeed) {
							report.addViolation(new Violation(tokens[i - 1].location,
								"space before a line break", RuleKind.Whitespace));
						}
						while (tokens[i].kind == Frontend.TokenKind.WhitespaceSpace) {
							spaces++;
							while (tokens[i].kind == Frontend.TokenKind.WhitespaceSpace) {
								spaces++;
								i++;
							}
						}
						break;
					default:
						spaces = 0;
						break;
				}
				if (spaces > 1) {
					var message = "too many consecutive space characters: " + spaces;
					if (spaces > 2) {
						message += " [did you mean to tab here?]";
					}
					report.addViolation(new Violation(spaceLocation, message, RuleKind.Whitespace));
				}
				spaces = 0;
			}
		}
	}
}
