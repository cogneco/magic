Correct: class {
	free: override func {
		blah()
		while (bin count > 20) {
			version(asdf) { Debug print("asdf") }
			b := asdf
		}
		super()
	}
	contains: func ~asdf (list: VectorList) -> VectorList<Int> {
		result := VectorList<Int> new()
		for (i in 0 .. list count)
			if (this contains(list[i]))
				result add(i)
		result
	}
	func: foobar -> String {
		if (condition)
			"foobar"
		else if (condition2)
			"koobar"
		else
			"moobar"
	}
	test: func {
		destinationX = (
			8 * source[x + step] -
			8 * source[x - step] +
			source[x - 2 * step] -
			source[x + 2 * step]
		} as Float / (12.0f * step)
	}
}

Incorrect: class {
	init: func ~this (original: This) {
		for (i in 0 .. original count)
				this append(original[i] copy()) // Violation
	}
	CreateAlphaByteString: class {
		init: func
			makeAlphaString: static func (filename, name: String) -> String // // Violation
	}
}
