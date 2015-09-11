Ignored: cover from SomeCover

Classes: enum {
	Foobar
	Moobar
}

Foobar: class {
	p: Bool
	f1: func (foobar: Foobar, p: Bool) -> Bool {
		return p
	}
	f2: func (foobar: Foobar, p, p2: Bool) -> Bool {
		return foobar p && (p || p2)
	}
	f3: func -> Bool {
		// This should trigger a violation, since class/cover members should always
		// be fully qualified with 'this', or 'This' for static members.
		return f1(This, false) && f2(This, true, false)
	}
	f4: func -> Bool {
		return this f1(This, false) && this f2(This, true, false) && This f5()
	}
	f5: static func -> Bool {
		return true
	}
	f6: static func {
		// This should not violate the rule
		v := Classes Foobar
	}
}

Moobar: cover {
	p: Bool
	f1: func (foobar: Moobar, p: Bool) -> Bool {
		return p
	}
	f2: func (foobar: Moobar, p, p2: Bool) -> Bool {
		return foobar p && (p || p2)
	}
	f3: func -> Bool {
		// This should trigger a violation, since class/cover members should always
		// be fully qualified with 'this', or 'This' for static members.
		return f1(This, false) && f2(This, true, false)
	}
	f4: func -> Bool {
		return this f1(This, false) && this f2(This, true, false) && This f5()
	}
	f5: static func -> Bool {
		return true
	}
}
