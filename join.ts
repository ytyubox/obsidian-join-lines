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
	const currLineLevel = checkListLevel(currLineText);
	const nextLineLevel = checkListLevel(nextLineText);

	if (currLineLevel === nextLineLevel) {
		// Remove numbering (e.g., "2. ") from the next line
		nextLineText = trimMarkdownListSymbol(nextLineText);

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
	return ["", 0];
}

function isNullOrEmpty(str: string | null | undefined): boolean {
	return str === null || str === undefined || str.trim().length === 0;
}
function checkListLevel(lineText: string): number {
	const match = lineText.match(/^(\s*)\d+\.\s*/);
	if (match) {
		return match[1].length / 2 + 1;
	}
	return 0;
}
function trimMarkdownListSymbol(lineText: string): string {
	return lineText.replace(/^\s*([-*+]\s+|\d+\.\s+)/, "").trim();
}
