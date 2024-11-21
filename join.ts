export function joinLinesSelectText(text: string) {
	return text.replace(/\n/g, " ");
}

export function joinLinesCursorText(
	currLineText: string,
	nextLineText: string
) {
	return currLineText + " " + nextLineText;
}
