
/// <reference path="../Error/Handler" />
/// <reference path="../Utilities/Iterator" />
/// <reference path="../Utilities/BufferedIterator" />
/// <reference path="../Tokens/Token" />
/// <reference path="../Tokens/Substance" />
/// <reference path="Source" />
/// <reference path="Module" />

module Magic.SyntaxTree {
	export class Parser implements Utilities.Iterator<Module> {
		source: Source
		constructor(tokens: Utilities.Iterator<Tokens.Substance>, errorHandler: Error.Handler) {
			this.source = new Source(tokens, errorHandler)
		}
		next(): Module {
			return Module.parse(this.source)
		}
	}
}
