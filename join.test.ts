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
		expect(joinLinesCursorText("current line", "")).toStrictEqual([
			"current line",
			12,
		]);
	});
	it("line with space suffix, empty next line", () => {
		expect(joinLinesCursorText("current line         ", "")).toStrictEqual([
			"current line",
			12,
		]);
	});

	it("line with prefix and a suffix, empty next line", () => {
		expect(
			joinLinesCursorText("   current line         ", "")
		).toStrictEqual(["   current line", 15]);
	});

	it("line with space suffix, next line", () => {
		expect(
			joinLinesCursorText("current line         ", "next line")
		).toStrictEqual(["current line next line", 13]);
	});

	it("line with prefix and a suffix, next line", () => {
		expect(
			joinLinesCursorText("   current line         ", "next line")
		).toStrictEqual(["   current line next line", 16]);
	});

	it("line with prefix and a suffix, next line with prefix and a suffix", () => {
		expect(
			joinLinesCursorText("   current line         ", "    next line    ")
		).toStrictEqual(["   current line next line", 16]);
	});

	fit("order list line, next order list line", () => {
		expect(
			joinLinesCursorText("1. current line", "2. next line")
		).toStrictEqual(["1. current line next line", 16]);
	});

	it("order list line, next order list line", () => {
		expect(
			joinLinesCursorText("1. current line", "  1. next line")
		).toStrictEqual([
			dedent`
			1. current line
			2. next line
			`,
			28,
		]);
	});

	it("bullet list line, next bullet list line", () => {
		expect(
			joinLinesCursorText("- current line", "- next line")
		).toStrictEqual([
			dedent`
			- current line next line
			`,
			15,
		]);
	});

	it("order list line, next indent bullet list line", () => {
		expect(
			joinLinesCursorText("- current line", "  - next line")
		).toStrictEqual([
			dedent`
			- current line
			- next line
			`,
			28,
		]);
	});
});
