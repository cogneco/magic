/// <reference path="../../../Error/ConsoleHandler" />
/// <reference path="../../../Error/Position" />
/// <reference path="../../../Error/Location" />
/// <reference path="../../../Error/Region" />
/// <reference path="../../../IO/BufferedReader" />
/// <reference path="../../../IO/StringReader" />
/// <reference path="../../../Tokens/Lexer" />
/// <reference path="../../../Tokens/GapRemover" />
/// <reference path="../../../Unit/Fixture" />
/// <reference path="../../../Unit/Constraints/Is" />
/// <reference path="../../Parser" />
/// <reference path="../../Module" />
/// <reference path="../../Declarations/Class" />


module Magic.SyntaxTree.Tests {
	import Is = Unit.Constraints.Is
	export class ClassTest extends Unit.Fixture {
		constructor() {
			super("SyntaxTree.Declarations.Class")
			this.add("empty class", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				this.expect(classDeclaration, Is.Not().NullOrUndefined())
				this.expect(classDeclaration.getSymbol(), Is.Equal().To("Empty"))
			})
			this.add("generic class #1", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class <T> {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				this.expect(classDeclaration.getTypeParameters()[0].getName(), Is.Equal().To("T"))
			})
			this.add("generic class #2", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class <T, S> {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				this.expect(classDeclaration.getTypeParameters()[0].getName(), Is.Equal().To("T"))
				this.expect(classDeclaration.getTypeParameters()[1].getName(), Is.Equal().To("S"))
			})
			this.add("class extends", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class extends Full {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				this.expect(classDeclaration.getExtended().getName(), Is.Equal().To("Full"))
			})
			this.add("class implements", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class implements Enumerable, Enumerator {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				this.expect(classDeclaration.getImplemented()[0].getName(), Is.Equal().To("Enumerable"))
				this.expect(classDeclaration.getImplemented()[1].getName(), Is.Equal().To("Enumerator"))
			})
			this.add("generic class implements generic interfaces", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class <T, S> implements Interface1<T, S>, Interface2<T, S> {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				this.expect(classDeclaration.getImplemented()[0].getName(), Is.Equal().To("Interface1"))
				this.expect(classDeclaration.getImplemented()[0].getTypeParameters()[0].getName(), Is.Equal().To("T"))
				this.expect(classDeclaration.getImplemented()[0].getTypeParameters()[1].getName(), Is.Equal().To("S"))
				this.expect(classDeclaration.getImplemented()[1].getName(), Is.Equal().To("Interface2"))
				this.expect(classDeclaration.getImplemented()[1].getTypeParameters()[0].getName(), Is.Equal().To("T"))
				this.expect(classDeclaration.getImplemented()[1].getTypeParameters()[1].getName(), Is.Equal().To("S"))
			})
		}
	}
	Unit.Fixture.add(new ClassTest())
}
