//
// Glossary over ooc operators, keywords, separators and valid whitespace.
//
module Magic.Frontend {
	export class Glossary {

		private whitespaces = new Utilities.Dictionary<string, TokenKind>();
		private operators = new Utilities.Dictionary<string, TokenKind>();
		private keywords = new Utilities.Dictionary<string, TokenKind>();
		private separators = new Utilities.Dictionary<string, TokenKind>();

		constructor() {
			this.initialize();
		}
		isWhitespace(whitespace: string) {
			return this.whitespaces.containsKey(whitespace);
		}
		isOperator(operator: string) {
			return this.operators.containsKey(operator);
		}
		isKeyword(keyword: string) {
			return this.keywords.containsKey(keyword);
		}
		isSeparator(separator: string) {
			return this.separators.containsKey(separator);
		}
		getWhitespaceKind(whitespace: string) {
			return this.getTokenKind(this.whitespaces, whitespace, "whitespace");
		}
		getOperatorKind(operator: string) {
			return this.getTokenKind(this.operators, operator, "operator");
		}
		getKeywordKind(keyword: string) {
			return this.getTokenKind(this.keywords, keyword, "keyword");
		}
		getSeparatorKind(separator: string) {
			return this.getTokenKind(this.separators, separator, "separator");
		}
		private getTokenKind(dictionary: Utilities.Dictionary<string, TokenKind>, key: string, dictionaryName: string) {
			if (!dictionary.containsKey(key)) {
				throw new Error("-> [Glossary] the specified key '" + key + "' was not found in " + dictionaryName + " glossary");
			}
			return dictionary.getValue(key);
		}
		private initialize() {
			this.initializeWhitespaces();
			this.initializeOperators();
			this.initializeKeywords();
			this.initializeSeparators();
		}
		private initializeWhitespaces() {
			this.whitespaces.setValue("\r", TokenKind.WhitespaceCarriageReturn);
			this.whitespaces.setValue("\n", TokenKind.WhitespaceLineFeed);
			this.whitespaces.setValue("\t", TokenKind.WhitespaceTab);
			this.whitespaces.setValue("\0", TokenKind.WhitespaceNull);
			this.whitespaces.setValue(" ", TokenKind.WhitespaceSpace);
		}
		private initializeOperators() {
			this.operators.setValue("+", TokenKind.OperatorPlus);
			this.operators.setValue("+=", TokenKind.OperatorAddAssign);
			this.operators.setValue("=", TokenKind.OperatorAssign);
			this.operators.setValue("&", TokenKind.OperatorBitwiseAnd);
			this.operators.setValue("&=", TokenKind.OperatorBitwiseAndAssign);
			this.operators.setValue("|", TokenKind.OperatorBitwiseOr);
			this.operators.setValue("|=", TokenKind.OperatorBitwiseOrAssign);
			this.operators.setValue("^", TokenKind.OperatorBitwiseXor);
			this.operators.setValue("^=", TokenKind.OperatorBitwiseXorAssign);
			this.operators.setValue("<==>", TokenKind.OperatorComparison);
			this.operators.setValue(":=", TokenKind.OperatorDeclareAssign);
			this.operators.setValue(":==", TokenKind.OperatorDeclareCompare);
			this.operators.setValue("::=", TokenKind.OperatorDeclarePropertyAssign);
			this.operators.setValue("@", TokenKind.OperatorDereference);
			this.operators.setValue("/", TokenKind.OperatorDivide);
			this.operators.setValue("/=", TokenKind.OperatorDivideAssign);
			this.operators.setValue("==", TokenKind.OperatorEquals);
			this.operators.setValue("**", TokenKind.OperatorExponent);
			this.operators.setValue("**=", TokenKind.OperatorExponentAssign);
			this.operators.setValue(">", TokenKind.OperatorGreaterThan);
			this.operators.setValue(">=", TokenKind.OperatorGreaterThanOrEqual);
			this.operators.setValue("<<", TokenKind.OperatorLeftShift);
			this.operators.setValue("<<=", TokenKind.OperatorLeftShiftAssign);
			this.operators.setValue("<", TokenKind.OperatorLessThan);
			this.operators.setValue("<=", TokenKind.OperatorLessThanOrEqual);
			this.operators.setValue("&&", TokenKind.OperatorLogicalAnd);
			this.operators.setValue("||", TokenKind.OperatorLogicalOr);
			this.operators.setValue("%", TokenKind.OperatorModulo);
			this.operators.setValue("*", TokenKind.OperatorMultiply);
			this.operators.setValue("*=", TokenKind.OperatorMultiplyAssign);
			this.operators.setValue("~", TokenKind.OperatorNegate);
			this.operators.setValue("!", TokenKind.OperatorNot);
			this.operators.setValue("!=", TokenKind.OperatorNotEqual);
			this.operators.setValue(">>", TokenKind.OperatorRightShift);
			this.operators.setValue(">>=", TokenKind.OperatorRightShiftAssign);
			this.operators.setValue("-", TokenKind.OperatorMinus);
			this.operators.setValue("-=", TokenKind.OperatorSubtractAssign);
			this.operators.setValue("?", TokenKind.OperatorConditional);
			this.operators.setValue("..", TokenKind.OperatorRange);
			this.operators.setValue("->", TokenKind.OperatorReturnType);
			this.operators.setValue("=>", TokenKind.OperatorDoubleArrow);
			this.operators.setValue("++", TokenKind.OperatorPreIncrement)
		}
		private initializeKeywords() {
			this.keywords.setValue("__onheap__", TokenKind.KeywordOnHeap);
			this.keywords.setValue("this", TokenKind.KeywordThis);
			this.keywords.setValue("This", TokenKind.KeywordStaticThis);
			this.keywords.setValue("virtual", TokenKind.KeywordVirtual);
			this.keywords.setValue("override", TokenKind.KeywordOverride);
			this.keywords.setValue("break", TokenKind.KeywordBreak);
			this.keywords.setValue("continue", TokenKind.KeywordContinue);
			this.keywords.setValue("return", TokenKind.KeywordReturn);
			this.keywords.setValue("func", TokenKind.KeywordFunc);
			this.keywords.setValue("class", TokenKind.KeywordClass);
			this.keywords.setValue("cover", TokenKind.KeywordCover);
			this.keywords.setValue("enum", TokenKind.KeywordEnum);
			this.keywords.setValue("interface", TokenKind.KeywordInterface);
			this.keywords.setValue("from", TokenKind.KeywordFrom);
			this.keywords.setValue("abstract", TokenKind.KeywordAbstract);
			this.keywords.setValue("final", TokenKind.KeywordFinal);
			this.keywords.setValue("static", TokenKind.KeywordStatic);
			this.keywords.setValue("inline", TokenKind.KeywordInline);
			this.keywords.setValue("extends", TokenKind.KeywordExtends);
			this.keywords.setValue("extern", TokenKind.KeywordExtern);
			this.keywords.setValue("unmangled", TokenKind.KeywordUnmangled);
			this.keywords.setValue("implements", TokenKind.KeywordImplements);
			this.keywords.setValue("implicit", TokenKind.KeywordImplicit);
			this.keywords.setValue("import", TokenKind.KeywordImport);
			this.keywords.setValue("include", TokenKind.KeywordInclude);
			this.keywords.setValue("use", TokenKind.KeywordUse);
			this.keywords.setValue("if", TokenKind.KeywordIf);
			this.keywords.setValue("else", TokenKind.KeywordElse);
			this.keywords.setValue("for", TokenKind.KeywordFor);
			this.keywords.setValue("while", TokenKind.KeywordWhile);
			this.keywords.setValue("match", TokenKind.KeywordMatch);
			this.keywords.setValue("case", TokenKind.KeywordCase);
			this.keywords.setValue("as", TokenKind.KeywordAs);
			this.keywords.setValue("in", TokenKind.KeywordIn);
			this.keywords.setValue("into", TokenKind.KeywordInto);
			this.keywords.setValue("proto", TokenKind.KeywordProto);
			this.keywords.setValue("try", TokenKind.KeywordTry);
			this.keywords.setValue("catch", TokenKind.KeywordCatch);
			this.keywords.setValue("set", TokenKind.KeywordSet);
			this.keywords.setValue("get", TokenKind.KeywordGet);
			this.keywords.setValue("operator", TokenKind.KeywordOperator);
			this.keywords.setValue("const", TokenKind.KeywordConst);
			this.keywords.setValue("true", TokenKind.KeywordTrue);
			this.keywords.setValue("false", TokenKind.KeywordFalse);
			this.keywords.setValue("null", TokenKind.KeywordNull);
			this.keywords.setValue("new", TokenKind.KeywordNew);
		}
		private initializeSeparators() {
			this.separators.setValue(".", TokenKind.SeparatorDot);
			this.separators.setValue(":", TokenKind.SeparatorColon);
			this.separators.setValue(";", TokenKind.SeparatorSemicolon);
			this.separators.setValue(",", TokenKind.SeparatorComma);
			this.separators.setValue("[", TokenKind.SeparatorLeftBracket);
			this.separators.setValue("]", TokenKind.SeparatorRightBracket);
			this.separators.setValue("(", TokenKind.SeparatorLeftParanthesis);
			this.separators.setValue(")", TokenKind.SeparatorRightParanthesis);
			this.separators.setValue("{", TokenKind.SeparatorLeftCurly);
			this.separators.setValue("}", TokenKind.SeparatorRightCurly);
		}
	}
}