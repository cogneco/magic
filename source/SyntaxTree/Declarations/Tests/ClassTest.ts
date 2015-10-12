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
				var statements = parser.next().getStatements()
				var classDeclaration = <Declarations.Class> statements.next()
				this.expect(classDeclaration, Is.Not().NullOrUndefined())
				this.expect(classDeclaration.getSymbol(), Is.Equal().To("Empty"))
				this.expect(statements.next(), Is.NullOrUndefined())
				this.expect(parser.next(), Is.NullOrUndefined())
			})
			this.add("generic class #1", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class <T> {\n}\n"), handler)), handler)
				var module = parser.next()
				var statements = module.getStatements()
				var classDeclaration = <Declarations.Class> statements.next()
				this.expect(classDeclaration, Is.Not().NullOrUndefined())
				this.expect(classDeclaration.getTypeParameters().next().getName(), Is.Equal().To("T"))
				this.expect(statements.next(), Is.NullOrUndefined())
				this.expect(parser.next(), Is.NullOrUndefined())
			})
			this.add("generic class #2", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class <T, S> {\n}\n"), handler)), handler)
				var statements = parser.next().getStatements()
				var classDeclaration = <Declarations.Class> statements.next()
				this.expect(classDeclaration, Is.Not().NullOrUndefined())
				var typeParameters = classDeclaration.getTypeParameters()
				this.expect(typeParameters.next().getName(), Is.Equal().To("T"))
				this.expect(typeParameters.next().getName(), Is.Equal().To("S"))
				this.expect(statements.next(), Is.NullOrUndefined())
				this.expect(parser.next(), Is.NullOrUndefined())
			})
			this.add("class extends", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class extends Full {\n}\n"), handler)), handler)
				var classDeclaration = <Declarations.Class> parser.next().getStatements().next()
				this.expect(classDeclaration.getExtended().getName(), Is.Equal().To("Full"))
				this.expect(parser.next(), Is.NullOrUndefined())
			})
			this.add("class implements", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class implements Enumerable, Enumerator {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				var implemented = classDeclaration.getImplemented()
				this.expect(implemented.next().getName(), Is.Equal().To("Enumerable"))
				this.expect(implemented.next().getName(), Is.Equal().To("Enumerator"))
				this.expect(implemented.next(), Is.NullOrUndefined())
				this.expect(parser.next(), Is.NullOrUndefined())
			})
			this.add("generic class implements generic interfaces", () => {
				var handler = new Error.ConsoleHandler()
				var parser = new Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("Empty: class <T, S> implements Interface1<T, S>, Interface2<T, S> {\n}\n"), handler)), handler)
				var module = parser.next()
				var classDeclaration = <Declarations.Class> module.getStatements().next()
				var implemented = classDeclaration.getImplemented()
				var interface1 = implemented.next()
				this.expect(interface1.getName(), Is.Equal().To("Interface1"))
				var typeParameters1 = interface1.getTypeParameters()
				this.expect(typeParameters1.next().getName(), Is.Equal().To("T"))
				this.expect(typeParameters1.next().getName(), Is.Equal().To("S"))
				this.expect(typeParameters1.next(), Is.NullOrUndefined())
				var interface2 = implemented.next()
				this.expect(interface2.getName(), Is.Equal().To("Interface2"))
				var typeParameters2 = interface2.getTypeParameters()
				this.expect(typeParameters2.next().getName(), Is.Equal().To("T"))
				this.expect(typeParameters2.next().getName(), Is.Equal().To("S"))
				this.expect(typeParameters2.next(), Is.NullOrUndefined())
				this.expect(implemented.next(), Is.NullOrUndefined())
				this.expect(parser.next(), Is.NullOrUndefined())
			})
		}
	}
	Unit.Fixture.add(new ClassTest())
}
