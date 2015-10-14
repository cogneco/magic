/// <reference path="../Error/Region" />

module Magic.Tokens {
	export abstract class Token {
		constructor(private region: Error.Region) { }
		getRegion() { return this.region; }
		toString() {
			return this.region.toString()
		}
		isSeparator(symbol?: string): boolean {
			return false
		}
		isIdentifier(name?: string): boolean {
			return false
		}
		isOperator(symbol?: string): boolean {
			return false
		}
		isWhitespace(content?: string): boolean {
			return false
		}
	}
}
