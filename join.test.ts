import { joinLinesSelectText, joinLinesCursorText } from "./join";
import dedent from "dedent";

describe("join selected lines", () => {
	it("empty select", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});

	it("1 line selection", () => {
		expect(joinLinesSelectText("line 1")).toStrictEqual("line 1");
	});

	it("2 lines selection", () => {
		expect(
			joinLinesSelectText(dedent`
				line 1
				line 2
				`)
		).toStrictEqual("line 1 line 2");
	});

	it("too many linebreak with 2 lines selection", () => {
		expect(
			joinLinesSelectText(dedent`
				line 1



				line 2
				`)
		).toStrictEqual("line 1 line 2");
	});
	it("too many linebreak with 3 lines selection", () => {
		expect(
			joinLinesSelectText(dedent`
				line 1


				
				line 2



				
				line 3
				`)
		).toStrictEqual("line 1 line 2 line 3");
	});
});

describe("join cursor line", () => {
	it("empty next line", () => {
		expect(joinLinesCursorText("current line", "")).toStrictEqual(
			"current line"
		);
	});
	it("line with space suffix, empty next line", () => {
		expect(joinLinesCursorText("current line         ", "")).toStrictEqual(
			"current line"
		);
	});

	it("line with prefix and a suffix, empty next line", () => {
		expect(
			joinLinesCursorText("   current line         ", "")
		).toStrictEqual("   current line");
	});

	it("line with space suffix, next line", () => {
		expect(
			joinLinesCursorText("current line         ", "next line")
		).toStrictEqual("current line next line");
	});

	it("line with prefix and a suffix, next line", () => {
		expect(
			joinLinesCursorText("   current line         ", "next line")
		).toStrictEqual("   current line next line");
	});

	it("line with prefix and a suffix, next line with prefix and a suffix", () => {
		expect(
			joinLinesCursorText("   current line         ", "    next line    ")
		).toStrictEqual("   current line next line");
	});

	it("order list line with prefix and a suffix, next line with prefix and a suffix", () => {
		expect(
			joinLinesCursorText("   current line         ", "    next line    ")
		).toStrictEqual("   current line next line");
	});
});
