import Rule = require("./Rule");
import Token = require("./../../frontend/Token");
import TokenKind = require("./../../frontend/TokenKind");
import Report = require("./../Report");
import Violation = require("./../Violation");
import RuleKind = require("./../RuleKind");

class ThisUsageRule implements Rule {
	private classMembers: string[] = [];
	constructor() { }
	run(tokens: Token[], report: Report) {
		var className: string;
		var isClass = false;
		var isCoverFrom = false;
		for (var i = 0; i < tokens.length; i++) {
			if (tokens[i].kind == TokenKind.Identifier) {
				className = tokens[i].value;
				while (tokens[i].kind != TokenKind.WhitespaceLineFeed && tokens[i].kind != TokenKind.Eof) {
					if (tokens[i].kind == TokenKind.KeywordClass || tokens[i].kind == TokenKind.KeywordCover) {
						while (tokens[i].kind != TokenKind.SeparatorLeftCurly) {
							if (tokens[i].kind == TokenKind.KeywordFrom) {
								isCoverFrom = true;
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
				if (isClass && !isCoverFrom) {
					i = this.analyzeClassBody(tokens, report, i, className);
					isClass = false;
				}
			}
			isCoverFrom = false;
		}
		//this.classMembers = this.getClassMembers(tokens);
	}

	getClassMembers(tokens: Token[]) {
		var members: string[] = [];
		var previous = Token.empty;
		for (var i = 0; i < tokens.length; i++) {
			if (previous.kind == TokenKind.Identifier && tokens[i].kind == TokenKind.SeparatorColon) {
				i++;
				while (TokenKind[tokens[i].kind].indexOf("Whitespace") > -1) {
					i++;
				}
				switch (tokens[i].kind) {
					case TokenKind.KeywordClass:
					case TokenKind.KeywordCover:
						break;
					case TokenKind.KeywordStatic:
						break;
					case TokenKind.KeywordFunc:
						while (tokens[i].kind != TokenKind.SeparatorLeftCurly && tokens[i].kind != TokenKind.WhitespaceLineFeed) {
							i++;
						}
						break;
					case TokenKind.Identifier:
						break;
					default:
						break;
				}
			}
			previous = tokens[i];
		}

		return members;
	}

	analyzeClassBody(tokens: Token[], report: Report, index: number, name: string) {
		var delta = 1;
		index++;
		while (delta > 0 && tokens[index].kind != TokenKind.Eof && tokens[index].kind != TokenKind.KeywordFrom) {
			switch (tokens[index].kind) {
				case TokenKind.SeparatorLeftCurly:
					delta++;
					break;
				case TokenKind.SeparatorRightCurly:
					delta--;
					break;
				case TokenKind.Identifier:
					if (tokens[index].value === name) {
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

export = ThisUsageRule;