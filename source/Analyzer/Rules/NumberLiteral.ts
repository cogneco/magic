/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../../Frontend/TokenLocation" />
/// <reference path="../Violation" />
/// <reference path="../Report" />
/// <reference path="../RuleKind" />
/// <reference path="Rule" />


module Magic.Analyzer.Rules {
	export class NumberLiteral implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var offset = 0
			for (var i = 0; i < tokens.length; i++) {
				switch (tokens[i].kind) {
					case Frontend.TokenKind.LiteralBinary:
					case Frontend.TokenKind.LiteralHexadecimal:
					case Frontend.TokenKind.LiteralOctal:
						// offset = 2
						break;
					case Frontend.TokenKind.LiteralFloat:
					case Frontend.TokenKind.LiteralInteger:
						// offset = 1 if a float literal contains a ','
						break;
					default:
						break;
				}
			}
		}
	}
}
