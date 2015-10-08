/// <reference path="../Error/Region" />
/// <reference path="../Error/Handler" />
/// <reference path="../Utilities/Iterator" />
/// <reference path="../Tokens/Token" />
/// <reference path="../Tokens/Substance" />

module Magic.SyntaxTree {
	export class Source implements Utilities.Iterator<Tokens.Substance>, Error.Handler {
		private buffer: Tokens.Substance[] = []
		private readTokens: Tokens.Substance[] = []
		constructor(private backend: Utilities.Iterator<Tokens.Substance>, private errorHandler: Error.Handler) {
		}
		peek(position: number = 0): Tokens.Substance {
			var next: Tokens.Substance = null
			while (position > this.buffer.length - 1 && (next = this.backend.next())) {
				this.buffer.push(next)
			}
			return position > this.buffer.length - 1 ? null : this.buffer[position]
		}
		next(): Tokens.Substance {
			var result = this.peek()
			if (this.buffer.length > 0)
				this.readTokens.push(this.buffer.shift())
			return result
		}
		raise(message: string | Error.Message, level = Error.Level.Critical, type = Error.Type.Gramatical, region?: Error.Region): void {
			if (typeof message == "string") {
				if (!region)
					region = this.peek().getRegion()
				message = new Error.Message(<string>message, level, type, region)
			}
			this.errorHandler.raise(message.toString())
		}
	}
}
