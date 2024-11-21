export function joinLinesSelectText(text: string) {
	return text.replace(/\n+/gm, " ");
}

export function joinLinesCursorText(
	currLineText: string,
	nextLineText: string
) {
	return currLineText + " " + nextLineText;
}
