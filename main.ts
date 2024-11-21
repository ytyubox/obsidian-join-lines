import { Editor, Plugin } from "obsidian";

export default class JoinLinesPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "join-lines",
			name: "Join lines",
			editorCallback(editor) {
				joinLines(editor);
			},
		});
	}
}

function joinLinesSelectText(text: string) {
	return text.replace(/\n/g, " ");
}

function joinLinesCursorText(currLineText: string, nextLineText: string) {
	return currLineText + " " + nextLineText;
}
function joinLines(editor: Editor) {
	const selectedText = editor.getSelection();
	if (selectedText && selectedText.includes("\n")) {
		const joinedText = joinLinesSelectText(selectedText);
		editor.replaceSelection(joinedText);
		return;
	}
	// No text selected:
	// join current line with next line,
	// and preserve the cursor position
	const cursor = editor.getCursor();
	const currLine = cursor.line;
	const nextLine = currLine + 1;
	const currLineText = editor.getLine(currLine);
	const nextLineText = editor.getLine(nextLine);
	const joinedText = jo
	editor.replaceRange(
		joinedText,
		{ line: currLine, ch: 0 },
		{ line: nextLine, ch: nextLineText.length }
	);
	editor.setCursor({ line: currLine, ch: cursor.ch });
}
