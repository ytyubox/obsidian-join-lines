import { Editor, Plugin } from "obsidian";
import { joinLinesSelectText, joinLinesCursorText } from "./join";
export default class JoinLinesPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "join-next-lines",
			name: "Join next lines",
			editorCallback(editor) {
				joinNextLines(editor);
			},
		});
		this.addCommand({
			id: "join-previous-lines",
			name: "Join previous lines",
			editorCallback(editor) {
				joinPreviousLines(editor);
			},
		});
	}
}

function joinNextLines(editor: Editor) {
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
	const [joinedText, cursorCH] = joinLinesCursorText(
		currLineText,
		nextLineText
	);
	editor.replaceRange(
		joinedText,
		{ line: currLine, ch: 0 },
		{ line: nextLine, ch: nextLineText.length }
	);
	editor.setCursor({ line: currLine, ch: cursorCH });
}

function joinPreviousLines(editor: Editor) {
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
	const [joinedText, cursorCH] = joinLinesCursorText(
		currLineText,
		nextLineText
	);
	editor.replaceRange(
		joinedText,
		{ line: currLine, ch: 0 },
		{ line: nextLine, ch: nextLineText.length }
	);
	editor.setCursor({ line: currLine, ch: cursorCH });
}
