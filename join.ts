export function joinLinesSelectText(text: string) {
	return text.replace(/\n+/gm, " ");
}

export function joinLinesCursorText(
	currLineText: string,
	nextLineText: string
) {
	if (isNullOrEmpty(nextLineText)) {
		return currLineText;
	}
	return currLineText + " " + nextLineText;
}

function isNullOrEmpty(str: string | null | undefined): boolean {
	return str === null || str === undefined || str.trim().length === 0;
}
