/// <reference path="../Error/Region" />
/// <reference path="Token" />
/// <reference path="Gap" />

module Magic.Tokens {
	export abstract class Substance extends Token {
		private pregap: Gap[] = []
		private postgap: Gap[] = []
		constructor(region: Error.Region) {
			super(region)
		}
		getPregap() { return this.pregap }
		setPregap(value: Gap[]) { this.pregap = value }
		getPostgap() { return this.postgap }
		setPostgap(value: Gap[]) { this.postgap = value }
	}
}
