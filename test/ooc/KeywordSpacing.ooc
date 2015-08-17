Foobar: class {
	// Missing space after keyword
	foo: extern(foo) func (Float) -> Float
	// in? should not trigger a missing-space violation here
	in?: func
	// VectorList<This> should not cause a violation
	someFunc: func (moo: Int) -> Foobar<This> {
		moo = foo
	}
}