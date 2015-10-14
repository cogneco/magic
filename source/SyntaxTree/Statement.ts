/// <reference path="Source" />
/// <reference path="Node" />
/// <reference path="../Tokens/Token" />
/// <reference path="../Tokens/EndOfFile" />

module Magic.SyntaxTree {
	export abstract class Statement extends Node {
		constructor(tokens: Tokens.Substance[]) {
			super(tokens)
		}
		private static statementParsers: ((source: Source) => Statement)[] = []
		static addParser(parser: (source: Source) => Statement) {
			Statement.statementParsers.push(parser)
		}
		static parse(source: Source): Statement {
			var result: Statement
			var i = 0
			do
				result = Statement.statementParsers[i++](source)
			while (!result && i < Statement.statementParsers.length)
			return result
		}
	}
}
