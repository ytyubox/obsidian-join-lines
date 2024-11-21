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
	const currLineMatch = currLineText.match(/^(\d+)\.\s*/);
  const currLineLevel = checkListLevel(currLineText);
  const nextLineLevel = checkListLevel(nextLineText);
	const nextLineMatch = nextLineText.match(/^\s*(\d+)\.\s*/);
  if (currLineLevel == nextLineLevel) {

  } else if (currLineMatch && nextLineMatch) {
		const nextNumber = parseInt(currLineMatch[1]) + 1;
		nextLineText = nextLineText
			.replace(/^\s*\d+\.\s*/, `${nextNumber}. `)
			.trim();
		return `${currLineText}\n${nextLineText}`;
	}

	// Remove numbering (e.g., "2. ") from the next line
	nextLineText = nextLineText.replace(/^\d+\.\s*/, "").trim();
	return currLineText + " " + nextLineText;
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