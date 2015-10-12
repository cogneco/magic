/// <reference path="../Utilities/Iterator" />
/// <reference path="Token" />
/// <reference path="EndOfFile" />


module Magic.Tokens {
	export class Consumer {
		constructor(private backend: Utilities.Iterator<Token>) {
		}
		run() {
			while (!(this.backend.next() instanceof EndOfFile))
				;
		}
	}
}
