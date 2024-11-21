export function joinLinesSelectText(text: string) {
	return text.replace(/\n+/gm, " ");
}

export function joinLinesCursorText(
	currLineText: string,
	nextLineText: string
) {
	currLineText = currLineText.trimEnd();
	if (isNullOrEmpty(nextLineText)) {
		return currLineText;
	}
	// Remove numbering (e.g., "2. ") from the next line
	nextLineText = nextLineText.replace(/^\d+\.\s*/, "").trim();
	return currLineText + " " + nextLineText;
}

function isNullOrEmpty(str: string | null | undefined): boolean {
	return str === null || str === undefined || str.trim().length === 0;
}
