/// <reference path="../../Frontend/Token" />
/// <reference path="../../Frontend/TokenKind" />
/// <reference path="../Report" />
/// <reference path="Rule" />

//
// TODO: The analyzer should not work with a list of tokens.
// Instead, it should work with a proper parse tree. This is just
// temporary.
//
module Magic.Analyzer.Rules {
	export interface Rule {
		run(tokens: Frontend.Token[], report: Report): void;
	}
}
