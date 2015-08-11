import Rule = require("./Rule");
import Token = require("./../../frontend/Token");
import TokenKind = require("./../../frontend/TokenKind");
import TokenLocation = require("../../frontend/TokenLocation");
import Report = require("./../Report");
import Violation = require("./../Violation");
import RuleKind = require("./../RuleKind");

class EmptyLinesRule implements Rule {
	constructor() { }
	run(tokens: Array<Token>, report: Report) {
		var linefeeds = 0;
		var linefeedLocation: TokenLocation;
		var foundLeftCurly = false;
		if (tokens[0].kind == TokenKind.WhitespaceLineFeed) {
			report.addViolation(new Violation(tokens[0].location,
					"unnecessary empty line(s) at beginning of file", RuleKind.Whitespace));
		}
		for (var i = 0; i < tokens.length; i++) {
			switch (tokens[i].kind) {
				case TokenKind.WhitespaceLineFeed:
					var enough = false;
					linefeedLocation = tokens[i + 1].location;
					while (!enough) {
						i++;
						switch (tokens[i].kind) {
							case TokenKind.WhitespaceLineFeed:
								linefeeds++;
								break;
							case TokenKind.WhitespaceSpace:
							case TokenKind.WhitespaceTab:
								break;
							case TokenKind.SeparatorRightCurly:
								foundLeftCurly = false;
							default:
								enough = true;
								break;
						}
					}
					break;
				case TokenKind.SeparatorLeftCurly:
					foundLeftCurly = true;
					break;
				case TokenKind.WhitespaceSpace:
				case TokenKind.WhitespaceTab:
				case TokenKind.LineComment:
				case TokenKind.BlockComment:
					break;
				default:
					foundLeftCurly = false;
					break;
			}
			if (linefeeds > 0 && tokens[i].kind == TokenKind.Eof) {
				report.addViolation(new Violation(linefeedLocation,
					"unnecessary empty line(s) before end of file", RuleKind.Whitespace));
			}
			if (linefeeds > 0 && foundLeftCurly) {
				report.addViolation(new Violation(linefeedLocation,
					"unnecessary empty line(s) after opening curly", RuleKind.Whitespace));
				foundLeftCurly = false;
			}
			if (linefeeds > 0 && tokens[i].kind == TokenKind.SeparatorRightCurly) {
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

export = EmptyLinesRule;