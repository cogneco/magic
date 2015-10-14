/// <reference path="../Error/Region" />
/// <reference path="Token" />

module Magic.Tokens {
	export abstract class Gap extends Token {
		constructor(region: Error.Region) {
			super(region)
		}
	}
}
