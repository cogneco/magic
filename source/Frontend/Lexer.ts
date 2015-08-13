module Magic.Frontend {
	export class Lexer {
		private line = 1;
		private column = 1;

		private reader: CharacterReader;
		// Currently, we want to treat the entire use/import/include line as a single token,
		// minus the actual keyword. So, 'use collections/generic' == [KeywordUse][SPACE][Import]
		// This quick-fix should be removed once the analyzer works with a proper parse tree rather
		// than a list of tokens.
		private nextIsImport = false;

		constructor(private sourceFile: string, private glossary: Glossary) {
			this.reader = new CharacterReader(sourceFile);
		}

		getTokenList() {
			var t: Token;
			var list = [];
			while ((t = this.getNextToken()).kind != TokenKind.Eof) {
				list.push(t);
			}
			list.push(t);
			return list;
		}

		private getNextToken() {
			var result: Token = null;
			if (this.reader.hasNext) {
				var next = this.reader.getNext();
				var peek = this.reader.peek();
				// Whitespace
				if (this.isWhitespace(next)) {
					result = new Token(this.location, this.glossary.getWhitespaceKind(next), next);
				}
				else if (next == "\\") {
					result = new Token(this.location, TokenKind.LineBreak, next);
				}
				else if (this.nextIsImport) {
					result = this.handleImport(next);
				}
				// Comment
				else if (next === "/" && (peek === "/" || peek === "*")) {
					result = this.handleComment();
				}
				// Numeric literal (binary, octal, decimal and hexadecimal)
				else if (this.isDigit(next)) {
					result = this.handleNumericLiteral(next);
				}
				// String literal
				else if (next === "\"") {
					result = this.handleStringLiteral();
				}
				// Char literal
				else if (next === "'") {
					result = new Token(this.location, TokenKind.LiteralChar, this.reader.getNext(), 2);
					this.reader.advance();
				}
				// Keyword, identifier (words)
				else if (this.isValidIdentifierCharacter(next, true)) {
					result = this.handleWord(next);
				}
				// Operator, separator (special characters)
				else if (!this.isValidIdentifierCharacter(next)) {
					result = this.handleOperatorOrSeparator(next);
				}
				else {
					throw new Error("-> [Lexer] unable to handle '" + next + "' (peek = '" + peek + "')");
				}
			} else {
				result = new Token(this.location, TokenKind.Eof, "\0");
			}
			this.updateLocation(result);
			return result;
		}

		private handleImport(firstChar: string) {
			var result = firstChar;
			while (this.reader.hasNext && this.reader.peek() !== "\n") {
				result += this.reader.getNext();
			}
			this.nextIsImport = false;
			return new Token(this.location, TokenKind.Import, result);
		}

		private handleStringLiteral() {
			var literal: string = "";
			var next = "";
			while (this.reader.hasNext && this.reader.peek() !== "\"") {
				next = this.reader.getNext();
				if (next === "\\") {
					literal += next;
					next = this.reader.getNext();
				}
				literal += next;
			}
			this.reader.advance();
			return new Token(this.location, TokenKind.LiteralString, literal, 2);
		}

		private handleNumericLiteral(firstDigit: string) {
			var result: Token;
			var peek = this.reader.peek();
			// Literals in other bases than decimal must lead with a 0 and a base specifier.
			if (firstDigit === "0" && this.isNumericBaseSpecifier(peek)) {
				switch (peek) {
					case "b":
						result = this.handleOtherBaseNumericLiteral(firstDigit, TokenKind.LiteralBinary, this.isBinaryDigit);
						break;
					case "c":
						result = this.handleOtherBaseNumericLiteral(firstDigit, TokenKind.LiteralOctal, this.isOctalDigit);
						break;
					case "x":
						result = this.handleOtherBaseNumericLiteral(firstDigit, TokenKind.LiteralHexadecimal, this.isHexadecimalDigit);
						break;
				}
			} else {
				result = this.handleDecimalLiteral(firstDigit);
			}
			return result;
		}

		//
		// Handles binary, octal and hexadecimal literals.
		// The validity of each digit in the literal is checked by the callback 'fn'.
		//
		private handleOtherBaseNumericLiteral(firstDigit: string, kind: TokenKind, fn: (c: string) => boolean) {
			var literal = firstDigit + this.reader.getNext();
			while (this.reader.hasNext && fn(this.reader.peek())) {
				literal += this.reader.getNext();
			}
			return new Token(this.location, kind, literal);
		}

		private handleDecimalLiteral(firstDigit: string) {
			var kind: TokenKind;
			var literal = firstDigit;
			var next: string;
			var peek: string = this.reader.peek();
			var foundDot = false;
			var isFloat = false;
			var addToLength = 0;
			while (this.reader.hasNext && this.isDigit(peek, !foundDot)) {
				next = this.reader.getNext();
				peek = this.reader.peek();
				if (next === ".") {
					// See if we're dealing with the range operator ".."
					// If so, we need to rewind and let the lexer catch it on the next call
					if (peek === ".") {
						this.reader.rewind();
						break;
					}
					foundDot = isFloat = true;
				}
				literal += next;
			}
			if (peek === "f") {
				this.reader.advance();
				addToLength = 1;
			}
			kind = isFloat ? TokenKind.LiteralFloat : TokenKind.LiteralInteger
			return new Token(this.location, kind, literal, addToLength);
		}

		private handleOperator(firstChar: string) {
			var op = firstChar;
			var peek: string;
			var result: Token;
			while (this.reader.hasNext) {
				peek = this.reader.peek();
				if (this.isValidIdentifierCharacter(peek) || this.isSeparator(peek) || this.isWhitespace(peek) || peek === "\"") {
					break;
				}
				op += this.reader.getNext();
			}
			if (this.glossary.isOperator(op)) {
				result = new Token(this.location, this.glossary.getOperatorKind(op), op);
			} else {
				// HACK: This is for the cases where two operators are next to each other,
				// such as >* or *- etc. This needs a more robust solution ASAP.
				op = op.slice(0, op.length - 1);
				result = new Token(this.location, this.glossary.getOperatorKind(op), op);
				this.reader.rewind();
			}
			return result;
		}

		private handleOperatorOrSeparator(firstChar: string) {
			var result: Token;
			var peek = this.reader.peek();
			// Since operators :=, ::= and :== start with a separator, we need to
			// check manually for these here. We also check for the range operator ".." and
			// varargs, "..."
			if (this.isOperator(firstChar)) {
				result = this.handleOperator(firstChar);
			} else if (firstChar === ":" && (peek === ":" || peek === "=")) {
				result = this.handleOperator(firstChar + this.reader.getNext());
			} else if (firstChar === "." && peek === ".") {
				this.reader.advance();
				if (this.reader.peek() === ".") {
					this.reader.advance()
					result = new Token(this.location, TokenKind.VarArgs, "...");
				} else {
					result = new Token(this.location, TokenKind.OperatorRange, "..");
				}
				//this.reader.advance()
			}
			else {
				result = new Token(this.location, this.glossary.getSeparatorKind(firstChar), firstChar);
			}
			return result;
		}

		private handleWord(firstChar: string) {
			var word = firstChar;
			var result: Token;
			while (this.reader.hasNext && this.isValidIdentifierCharacter(this.reader.peek())) {
				word += this.reader.getNext();
			}
			if (this.isKeyword(word)) {
				var kind = this.glossary.getKeywordKind(word);

				switch (kind) {
					case TokenKind.KeywordTrue:
					case TokenKind.KeywordFalse:
						result = new Token(this.location, TokenKind.LiteralBoolean, word);
						break;
					case TokenKind.KeywordUse:
					case TokenKind.KeywordImport:
					case TokenKind.KeywordInclude:
						this.nextIsImport = true;
					default:
						result = new Token(this.location, kind, word);
						break;
				}
			} else {
				result = new Token(this.location, TokenKind.Identifier, word);
			}
			return result;
		}

		private handleComment() {
			return this.reader.getNext() === "/" ? this.handleLineComment() : this.handleBlockComment();
		}

		private handleLineComment(): Token {
			var comment = "";
			while (this.reader.hasNext && this.reader.peek() !== "\n") {
				comment += this.reader.getNext();
			}
			return new Token(this.location, TokenKind.LineComment, comment, 2);
		}

		private handleBlockComment(): Token {
			var comment = "";
			while (this.reader.hasNext) {
				var c = this.reader.getNext();
				if (c === "*" && this.reader.peek() === "/") {
					break;
				}
				comment += c;
			}
			this.reader.advance();
			return new Token(this.location, TokenKind.BlockComment, comment, 4);
		}

		private updateLocation(lastToken: Token) {
			switch (lastToken.kind) {
				case TokenKind.WhitespaceLineFeed:
					this.line++;
					this.column = 1;
					break;
				case TokenKind.WhitespaceTab:
					// TODO: Make tab width a setting and not hard-coded
					this.column += 4;
					break;
				case TokenKind.LiteralString:
				case TokenKind.BlockComment:
					this.column += lastToken.length;
					this.line += Utilities.String.substringCount(lastToken.value, "\n");
					break;
				default:
					this.column += lastToken.length;
					break;
			}
		}

		private get location() {
			return new TokenLocation(this.sourceFile, this.line, this.column);
		}

		private isWhitespace(c: string) {
			return this.glossary.isWhitespace(c);
		}

		private isKeyword(keyword: string) {
			return this.glossary.isKeyword(keyword);
		}

		private isOperator(operator: string) {
			return this.glossary.isOperator(operator);
		}

		private isSeparator(separator: string) {
			return this.glossary.isSeparator(separator);
		}

		// Identifiers must start with a letter or an underscore.
		private isValidIdentifierCharacter(c: string, first = false) {
			return first ? (this.isLetter(c) || c === "_") : this.isAlphaNumeric(c, true);
		}

		private isAlphaNumeric(c: string, acceptUnderscore = false) {
			return this.isLetter(c) || this.isDigit(c) || (acceptUnderscore && c === "_");
		}

		private isLetter(c: string) {
			var cc = c.charCodeAt(0);
			return (cc > 64 && cc < 91) || (cc > 96 && cc < 123)
		}

		private isDigit(c: string, acceptDot = false) {
			var cc = c.charCodeAt(0);
			return (cc > 47 && cc < 58) || (acceptDot ? c == "." : false);
		}

		private isHexadecimalDigit(c: string) {
			var cc = c.charCodeAt(0);
			return (cc > 47 && cc < 58) || (cc > 64 && cc < 71) || (cc > 96 && cc < 103);
		}

		private isBinaryDigit(c: string) {
			return c === "0" || c === "1";
		}

		private isOctalDigit(c: string) {
			var cc = c.charCodeAt(0);
			return cc > 47 && cc < 56;
		}

		private isNumericBaseSpecifier(c: string) {
			return c === "b" || c === "c" || c === "x"
		}

	}
}