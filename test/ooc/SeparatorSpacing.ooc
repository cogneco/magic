// This line should trigger three violations
foobar: Int {	get {Int moo~foo(this x, this y)}}
// This line should not trigger a violation
foobar: Int { get { Int moo~foo(this x, this y) }}