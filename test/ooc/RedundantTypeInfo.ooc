// This line should not trigger a violation
Foobar: func -> SomeType { SomeType new(this width as Float, this height as Float, this depth as Float) }
// This line should trigger a violation
Moobar: func (x: Float, y: Float, z: Float) -> Koobar {
	// Dummy comment
}