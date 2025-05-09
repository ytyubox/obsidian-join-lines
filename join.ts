function parseHeading(lineText: string): { level: number; text: string } {
	const match = lineText.match(/^(#+)\s*(.*)$/);
	if (match) {
		return { level: match[1].length, text: match[2].trim() };
	}
	return { level: 0, text: lineText.trim() };
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
	if (currLineText.includes("$$") && nextLineText.endsWith("$$")) {
		if (currLineText.trimStart().startsWith("$$")) {
			currLineText = currLineText.trim().replace(/^\$\$\s+/, "$");
			nextLineText = nextLineText.trim();
		} else {
			currLineText = currLineText.replace(/\$\$\s+/, "$");
			nextLineText = nextLineText.trim();
		}
		if (nextLineText === "$$") {
			return [currLineText + "$", currLineText.length];
		}
		nextLineText = nextLineText.trim().replace(/\s+\$\$$/, "$");
		if (currLineText === "$$") {
			return ["$" + nextLineText, 1];
		}
		return [currLineText + " " + nextLineText, currLineText.length];
	}

	if (currLineText.endsWith("$") && nextLineText.startsWith("$")) {
		currLineText = currLineText.slice(0, -1);
		return [
			currLineText + " " + nextLineText.slice(1),
			currLineText.length,
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
	console.log(isChinese(currLineText.slice(-1)), isChinese(nextLineText.slice(0, 1)));
	if (isChinese(currLineText.slice(-1)) && isChinese(nextLineText.slice(0, 1))) {
		return [currLineText + nextLineText, currLineText.length];
	}
	return [currLineText + " " + nextLineText, currLineText.length];
}
export function joinLinesSelectText(text: string): string {
	const match = text.match(/\n{2,}/);
	if (match?.length) {
		return text.replace(/\n{2,}/gm, "\n");
	}
	return text.replace(/\n/gm, " ");
}
export function joinLinesSelectText_mathblock(input: string): string {
	const lines = input.split("\n");
	let inMathBlock = false;
	let istextBlock = false;
	let result: string[] = [];
	let alignBlock: string[] = [];
	let blocks: number[] = [];

	for (let line of lines) {
		line = line.trim();
		console.log("line", line);
		console.log("result", result);
		console.log("alignBlock", alignBlock);
		if (line === "$$") {
			if (inMathBlock && !istextBlock) {
				// Closing the math block
				if (alignBlock.length > 1) {
					let last = result.pop() ?? "";
					if (last.startsWith("$$") && last.endsWith("$$")) {
						last.replace(/\$\$/gm, "").trim();
						alignBlock.push(last);
					} else {
						result.push(last);
					}
					result.push("$$\n\\begin{align}");
					result.push(
						...alignBlock.map(
							(l, i) =>
								`& ${l.trim()}${
									i < alignBlock.length - 1 ? " \\\\" : ""
								}`
						)
					);
					result.push("\\end{align}\n$$");
					alignBlock = [];
				} else {
					result.push(`$$\n${alignBlock[0]}\n$$`);
					alignBlock = [];
				}
			}
			inMathBlock = !inMathBlock;
		} else if (inMathBlock) {
			alignBlock.push(line.trim());
		} else if (line) {
			if (istextBlock) {
				let last = result.pop() ?? "";
				last += " " + line;
				result.push(last);
			} else {
				result.push(line);
			}
			istextBlock = true;
		} else {
			istextBlock = false;
		}
	}

	// Handle case where the last math block was not properly closed
	if (inMathBlock && alignBlock.length > 0) {
		result.push("\n$$");
		result.push(...alignBlock.map((l, i) => `${l.trim()}`));
	}

	return result.join("\n");
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

// 		return [currLineText + " " + nextLineText, currLineText.length ];
// 	}

// 	const currLineorder = currLineText.match(/^\s*(\d+)\.\s*/g);
// 	const nextLineorder = nextLineText.match(/^\s*(\d+)\.\s*/);

// 	if (currLineorder && nextLineorder) {
// 		const nextNumber = parseInt(currLineorder[0]) ;
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

function isChinese(str: string): boolean {
	return /[\u4e00-\u9fa5]/.test(str);
}
