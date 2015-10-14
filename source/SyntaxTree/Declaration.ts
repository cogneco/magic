/// <reference path="../Utilities/Iterator" />
/// <reference path="../Utilities/ArrayIterator" />
/// <reference path="../Tokens/Token" />
/// <reference path="../Tokens/EndOfFile" />
/// <reference path="Type/Name" />

module Magic.SyntaxTree {
	export abstract class Declaration extends Statement {
		constructor(private symbol: string, tokens: Tokens.Substance[]) {
			super(tokens)
		}
		getSymbol(): string { return this.symbol }
		static parseTypeParameters(source: Source): Type.Name[] {
			var result: Type.Name[] = []
			if (source.peek().isOperator("<")) {
				do {
					source.next() // consume "<" or ","
					if (!source.peek().isIdentifier())
						source.raise("Expected type parameter")
					result.push(Type.Name.parse(source.clone()))
				} while (source.peek().isSeparator(","))
				source.next() // consume ">"
			}
			return result
		}
	}
}
