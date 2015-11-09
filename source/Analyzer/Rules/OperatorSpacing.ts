/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

module Magic.Analyzer.Rules {
	export class OperatorSpacing implements Rule {
		constructor() { }
		run(tokens: Frontend.Token[], report: Report) {
			var index = 0;
			var t: Frontend.Token;
			var previous = Frontend.Token.empty;
			for (var i = 0; i < tokens.length; i++) {
				t = tokens[i];
				if (Frontend.TokenKind[t.kind].indexOf("Operator") > -1) {
					switch (t.kind) {
						// Leave the following operators alone, as they could mean
						// different things depending on the context, or are too much of a hassle
						// to work with when reading a token list instead of a parse tree.
						case Frontend.TokenKind.KeywordOperator:
						case Frontend.TokenKind.OperatorLessThan:
						case Frontend.TokenKind.OperatorGreaterThan:
						case Frontend.TokenKind.OperatorAssign:
						case Frontend.TokenKind.OperatorNot:
						case Frontend.TokenKind.OperatorConditional:
						case Frontend.TokenKind.OperatorExponent:
						case Frontend.TokenKind.OperatorNegate:
						case Frontend.TokenKind.OperatorMinus:
						case Frontend.TokenKind.OperatorMultiply:
						case Frontend.TokenKind.OperatorBitwiseAnd:
						case Frontend.TokenKind.OperatorBitwiseOr:
						case Frontend.TokenKind.OperatorLogicalOr:
						case Frontend.TokenKind.OperatorRightShift:
						case Frontend.TokenKind.OperatorPreIncrement:
							break;
						case Frontend.TokenKind.OperatorDereference:
							if (previous.kind == Frontend.TokenKind.WhitespaceSpace)
								report.addViolation(new Violation(t.location,
								"found a space before operator '" + t.value + "'", RuleKind.Operator));
							break;
						default:
							var left = previous;
							var right = tokens[i + 1];
							var leftKind = previous.kind;
							var rightKind = tokens[i + 1].kind;
							var missingLeft = left != null && leftKind != Frontend.TokenKind.WhitespaceSpace && rightKind != Frontend.TokenKind.WhitespaceLineFeed;
							var missingRight = rightKind != Frontend.TokenKind.WhitespaceSpace && rightKind != Frontend.TokenKind.WhitespaceLineFeed;

							if (missingLeft || missingRight) {
								var message: string;
								if (leftKind == Frontend.TokenKind.WhitespaceTab || rightKind == Frontend.TokenKind.WhitespaceTab) {
									message = "found a TAB instead of a SPACE "
									if (leftKind == Frontend.TokenKind.WhitespaceTab && rightKind == Frontend.TokenKind.WhitespaceTab) {
										message += "before and after"
									} else if (missingLeft) {
										message += "before"
									} else {
										message += "after";
									}
								} else {
									message = "missing space ";
									if (missingLeft && missingRight) {
										message += "before and after";
									} else if (missingLeft) {
										message += "before"
									} else {
										message += "after";
									}
								}
								report.addViolation(new Violation(t.location, message + " operator '" + t.value + "'", RuleKind.Operator));
							}
							break;
					}
				}
				previous = t;
			}
		}
	}
}
