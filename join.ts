export function joinLinesSelectText(text: string): string {
	return text.replace(/\n+/gm, " ");
}

export function joinLinesCursorText(
	currLineText: string,
	nextLineText: string
): [string, number] {
	currLineText = currLineText.trimEnd();
	if (isNullOrEmpty(nextLineText)) {
		return [currLineText, currLineText.length];
	}
	const [currLineLevel, currRestLine] = checkIndentLevel(currLineText);
	const [nextLineLevel, nextRestLine] = checkIndentLevel(nextLineText);
	console.log("^" + currLineText + "$", "currLineLevel", currLineLevel);
	if (currLineLevel >= nextLineLevel) {
		// Remove numbering (e.g., "2. ") from the next line
		nextLineText = trimMarkdownListSymbol(nextRestLine);

		return [currLineText + " " + nextLineText, currLineText.length + 1];
	}

	const currLineorder = currLineText.match(/^\s*(\d+)\.\s*/g);
	const nextLineorder = nextLineText.match(/^\s*(\d+)\.\s*/);

	if (currLineorder && nextLineorder) {
		const nextNumber = parseInt(currLineorder[0]) + 1;
		nextLineText = nextLineText
			.replace(/^\s*\d+\.\s*/, `${nextNumber}. `)
			.trim();
		if (currLineLevel > 0) {
			nextLineText = " ".repeat(currLineLevel) + nextLineText;
		}
		// console.log("nextLineResult: ^" + nextLineText + "$");
		const line = `${currLineText}\n${nextLineText}`;
		return [line, line.length];
	}
	const currLinelistMark = currLineText.match(/\s*(.*)\s/);
	if (currLinelistMark) {
		const listMark = currLinelistMark[0];
		nextLineText = nextLineText
			.replace(/^\s*[-*+]\.\s*/, `${listMark} `)
			.trim();
		if (currLineLevel > 0) {
			nextLineText = " ".repeat(currLineLevel) + nextLineText;
		}
		const line = `${currLineText}\n${nextLineText}`;
		return [line, line.length];
	}
	return ["__FAILURE_CASE__", -9999999999999];
}

function isNullOrEmpty(str: string | null | undefined): boolean {
	return str === null || str === undefined || str.trim().length === 0;
}
function checkIndentLevel(lineText: string): [number, string] {
	const match = lineText.match(/^([\s]+)([-*+]\s+|\d+\.\s+)/);
	if (match && match != undefined) {
		const matching = match[1];
		const level = matching.length;
		console.log(
			"^" + lineText + "$" + "matches",
			match,
			match.length,
			"match: ^" + matching + "$",
			level
		);
		return [level, lineText.trimStart()];
	}
	return [0, lineText];
}
function trimMarkdownListSymbol(lineText: string): string {
	return lineText.replace(/^\s*([-*+]\s+|\d+\.\s+)/, "").trim();
}
