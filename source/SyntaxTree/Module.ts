/// <reference path="Source" />
/// <reference path="../Utilities/Iterator" />
/// <reference path="../Utilities/ArrayIterator" />
/// <reference path="../Tokens/Token" />
/// <reference path="../Tokens/Substance" />
/// <reference path="../Tokens/EndOfFile" />
/// <reference path="Statement" />
/// <reference path="Declarations/Class" />

module Magic.SyntaxTree {
	export class Module extends Node {
		private namespace: string[]
		constructor(private statements: Statement[], tokens: Tokens.Substance[]) {
			super(tokens)
			this.namespace = tokens[0].getRegion().getResource().split("/")
		}
		getStatements(): Utilities.Iterator<Statement> {
			return new Utilities.ArrayIterator(this.statements)
		}
		static parse(source: Source): Module {
			var result: Module
			if (source.peek() && !(source.peek() instanceof Tokens.EndOfFile)) {
				var statements: Statement[] = []
				var next: Statement
				while (next = Statement.parse(source.clone()))
					statements.push(next)
				if (!<Tokens.EndOfFile>source.next())
					source.raise("Missing end of file.")
				result = new Module(statements, source.mark())
			}
			return result
		}
	}
}
