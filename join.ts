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

	if (currLineLevel == nextLineLevel) {
		// Remove numbering (e.g., "2. ") from the next line
		nextLineText = trimMarkdownListSymbol(nextRestLine);

		return [currLineText + " " + nextLineText, currLineText.length + 1];
	}

	const currLineMatch = currLineText.match(/^(\d+)\.\s*/);
	const nextLineMatch = nextLineText.match(/^\s*(\d+)\.\s*/);
	if (currLineMatch && nextLineMatch) {
		const nextNumber = parseInt(currLineMatch[1]) + 1;
		nextLineText = nextLineText
			.replace(/^\s*\d+\.\s*/, `${nextNumber}. `)
			.trim();
		const line = `${currLineText}\n${nextLineText}`;
		return [line, line.length];
	}
	return ["__FAILURE_CASE__", -9999999999999];
}

function isNullOrEmpty(str: string | null | undefined): boolean {
	return str === null || str === undefined || str.trim().length === 0;
}
function checkIndentLevel(lineText: string): [number, string] {
	const match = lineText.match(/^(\s*)([-*+]\s+|\d+\.)/);
	if (match && match != undefined) {
		const level = match[0].length / 2 + 1;
		console.log(match, match[0].length, level);
		return [level, lineText.trimStart()];
	}
	return [0, lineText];
}
function trimMarkdownListSymbol(lineText: string): string {
	return lineText.replace(/^\s*([-*+]\s+|\d+\.\s+)/, "").trim();
}
