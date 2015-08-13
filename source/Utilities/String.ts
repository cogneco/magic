module Magic.Utilities {
	export class String {
		static padLeft(value: string, paddingCharacter: string, width: number) {
			return String.pad(value, paddingCharacter, width, true);
		}
		static padRight(value: string, paddingCharacter: string, width: number) {
			return String.pad(value, paddingCharacter, width, false);
		}
		private static pad(value: string, paddingCharacter: string, width: number, padLeft = false) {
			var padding = "";
			var n = width - value.length;
			for (var i = 0; i < n; i++) {
				padding += paddingCharacter;
			}
			return padLeft ? padding + value : value + padding;
		}
		static substringCount(haystack: string, needle: string) {
			var i = 0;
			var count = 0;
			var index = 0;
			while ((i = haystack.indexOf(needle, index)) > -1) {
				index = i + needle.length;
				count++;
			}
			return count;
		}
	}
}