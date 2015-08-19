Correct: class {
	free: override func {
		asdf
		while (bin count > 20) {
			version(asdf) { Debug print("asdf") }
			b := asdf
		}
		this referenceCount _count = 0
	}
	contains: func ~asdf (list: VectorList) -> VectorList<Int> {
		result := VectorList<Int> new()
		for (i in 0..list count)
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
	CorrectNested: class {
		func: moobar -> String {
			"hello from moobar"
		}
	}
}