export function joinLinesSelectText(text: string): string {
	const match = text.match(/\n{2,}/);
	if (match?.length) {
		return text.replace(/\n{2,}/gm, "\n");
	}
	return text.replace(/\n/gm, " ");
}
export function joinNextLine(
	currLineText: string,
	nextLineText: string
): [string, number] {
	currLineText = currLineText.trimEnd();
	if (isNullOrEmpty(nextLineText)) {
		return [currLineText, currLineText.length];
	}
	if (isNullOrEmpty(currLineText)) {
		nextLineText = nextLineText.trim();
		return [nextLineText, 0];
	}
	nextLineText = nextLineText.trimEnd();
	if (
		currLineText.trimStart().startsWith("$$") &&
		nextLineText.endsWith("$$")
	) {
		currLineText = currLineText.trim().replace(/^\$\$\s+/, "$");
		nextLineText = nextLineText.trim();
		if (nextLineText === "$$") {
			return [currLineText + "$", currLineText.length + 1];
		}
		nextLineText = nextLineText.trim().replace(/\s+\$\$$/, "$");
		if (currLineText === "$$") {
			return ["$" + nextLineText, 1];
		}
		return [currLineText + " " + nextLineText, currLineText.length + 1];
	}

	if (currLineText.endsWith("$") && nextLineText.startsWith("$")) {
		currLineText = currLineText.slice(0, -1);
		return [
			currLineText + " " + nextLineText.slice(1),

			currLineText.length + 1,
		];
	}

	const [currLineLevel, currRestLine] = checkIndentLevel(currLineText);
	const [nextLineLevel, nextRestLine] = checkIndentLevel(nextLineText);
	const headingInfo = parseHeading(nextRestLine);
	if (headingInfo.level > 0) {
		nextLineText = headingInfo.text;
	} else {
		nextLineText = trimMarkdownListSymbol(nextRestLine);
	}
	return [currLineText + " " + nextLineText, currLineText.length + 1];
}

function parseHeading(lineText: string): { level: number; text: string } {
	const match = lineText.match(/^(#+)\s*(.*)$/);
	if (match) {
		return { level: match[1].length, text: match[2].trim() };
	}
	return { level: 0, text: lineText.trim() };
}

export function joinPreviousLine(
	previousLineText: string,
	currentLineText: string
): [string, number] {
	previousLineText = previousLineText.trimEnd();
	if (isNullOrEmpty(currentLineText)) {
		return [previousLineText, previousLineText.length];
	}

	const [currLineLevel, currRestLine] = checkIndentLevel(previousLineText);
	const [nextLineLevel, nextRestLine] = checkIndentLevel(currentLineText);

	currentLineText = trimMarkdownListSymbol(nextRestLine);

	return [
		previousLineText + " " + currentLineText,
		previousLineText.length + 1,
	];
}
function isNullOrEmpty(str: string | null | undefined): boolean {
	return str === null || str === undefined || str.trim().length === 0;
}
function checkIndentLevel(lineText: string): [number, string] {
	const match = lineText.match(/^([\s]+)([-*+]\s+|\d+\.\s+)/);
	if (match && match != undefined) {
		const matching = match[1];
		const level = matching.length;
		return [level, lineText.trimStart()];
	}
	return [0, lineText];
}

function trimMarkdownListSymbol(lineText: string): string {
	return lineText.replace(/^(\d+\.|\-)(?:\s(\d+\.|\-))*\s/, "").trim();
}

// function joinLinesCursorTextWithLists(
// 	currLineText: string,
// 	nextLineText: string
// ): [string, number] {
// 	currLineText = currLineText.trimEnd();
// 	if (isNullOrEmpty(nextLineText)) {
// 		return [currLineText, currLineText.length];
// 	}
// 	const [currLineLevel, currRestLine] = checkIndentLevel(currLineText);
// 	const [nextLineLevel, nextRestLine] = checkIndentLevel(nextLineText);
// 	if (currLineLevel >= nextLineLevel) {
// 		// Remove numbering (e.g., "2. ") from the next line
// 		nextLineText = trimMarkdownListSymbol(nextRestLine);

// 		return [currLineText + " " + nextLineText, currLineText.length + 1];
// 	}

// 	const currLineorder = currLineText.match(/^\s*(\d+)\.\s*/g);
// 	const nextLineorder = nextLineText.match(/^\s*(\d+)\.\s*/);

// 	if (currLineorder && nextLineorder) {
// 		const nextNumber = parseInt(currLineorder[0]) + 1;
// 		nextLineText = nextLineText
// 			.replace(/^\s*\d+\.\s*/, `${nextNumber}. `)
// 			.trim();
// 		if (currLineLevel > 0) {
// 			nextLineText = " ".repeat(currLineLevel) + nextLineText;
// 		}
// 		const line = `${currLineText}\n${nextLineText}`;
// 		return [line, currLineText.length];
// 	}
// 	const currLinelistMark = currLineText.match(/\s*(.*)\s/);
// 	if (currLinelistMark) {
// 		const listMark = currLinelistMark[0];
// 		nextLineText = nextLineText
// 			.replace(/^\s*[-*+]\.\s*/, `${listMark} `)
// 			.trim();
// 		if (currLineLevel > 0) {
// 			nextLineText = " ".repeat(currLineLevel) + nextLineText;
// 		}
// 		const line = `${currLineText}\n${nextLineText}`;
// 		return [line, 0];
// 	}
// 	return ["__FAILURE_CASE__", -9999999999999];
// }
