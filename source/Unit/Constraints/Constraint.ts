/// <reference path="Modifier" />

module Magic.Unit.Constraints {
	export abstract class Constraint extends Modifier {
		constructor(parent: Modifier = null) {
			super(parent)
		}
		abstract getExpectedValue(): any
	}
}
