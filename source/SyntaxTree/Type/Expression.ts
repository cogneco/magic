/// <reference path="../Source" />
/// <reference path="../Node" />
/// <reference path="../../Tokens/Substance" />
/// <reference path="../../Utilities/Iterator" />
/// <reference path="../../Utilities/ArrayIterator" />

module Magic.SyntaxTree.Type {
	export abstract class Expression extends Node {
		constructor(tokens: Tokens.Substance[]) {
			super(tokens)
		}
		private static typeParsers: ((source: Source) => Expression)[] = []
		static addParser(parser: (source: Source) => Expression) {
			Expression.typeParsers.push(parser)
		}
		static parse(source: Source): Expression {
			var result: Expression
			if (Expression.typeParsers.length > 0) {
				var i = 0
				do
					result = Expression.typeParsers[i++](source.clone())
				while (!result && i < Expression.typeParsers.length);
			}
			return result
		}
	}
}
