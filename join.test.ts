import { joinLinesSelectText, joinNextLine, joinPreviousLine } from "./join";
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
		).toStrictEqual("line 1\nline 2");
	});
	it("too many linebreak with 3 lines selection", () => {
		expect(
			joinLinesSelectText(dedent`
				line 1


				
				line 2



				
				line 3
				`)
		).toStrictEqual("line 1\nline 2\nline 3");
	});
});

describe("join cursor next line", () => {
	it("empty next line", () => {
		expect(joinNextLine("current line", "")).toStrictEqual([
			"current line",
			12,
		]);
	});
	it("line with space suffix, empty next line", () => {
		expect(joinNextLine("current line         ", "")).toStrictEqual([
			"current line",
			12,
		]);
	});

	it("line with prefix and a suffix, empty next line", () => {
		expect(joinNextLine("   current line         ", "")).toStrictEqual([
			"   current line",
			15,
		]);
	});

	it("line with space suffix, next line", () => {
		expect(
			joinNextLine("current line         ", "next line")
		).toStrictEqual(["current line next line", 13]);
	});

	it("line with prefix and a suffix, next line", () => {
		expect(
			joinNextLine("   current line         ", "next line")
		).toStrictEqual(["   current line next line", 16]);
	});

	it("line with prefix and a suffix, next line with prefix and a suffix", () => {
		expect(
			joinNextLine("   current line         ", "    next line    ")
		).toStrictEqual(["   current line next line", 16]);
	});

	it("order list line, next order list line", () => {
		expect(joinNextLine("1. current line", "2. next line")).toStrictEqual([
			"1. current line next line",
			16,
		]);
	});

	it("order list line, next order list line", () => {
		expect(joinNextLine("1. current line", "  1. next line")).toStrictEqual(
			["1. current line next line", 16]
		);
	});
	it("indented order list line, next order list line", () => {
		const s = "  ";
		expect(
			joinNextLine("  1. current line", "     1. next line")
		).toStrictEqual([`${s}1. current line next line`, 18]);
	});

	it("bullet list line, next bullet list line", () => {
		expect(joinNextLine("- current line", "- next line")).toStrictEqual([
			dedent`
			- current line next line
			`,
			15,
		]);
	});

	it("bullet list line, next indent bullet list line", () => {
		expect(joinNextLine("- current line", "  - next line")).toStrictEqual([
			"- current line next line",
			15,
		]);
	});
	it("indented bullet list line, next lower indented bullet list", () => {
		const s = "  ";
		expect(
			joinNextLine(`${s}- current line`, `${s}${s}- next line`)
		).toStrictEqual([`${s}- current line next line`, 17]);
	});
});

describe("join cursor previous line", () => {
	it("empty previous line", () => {
		expect(joinPreviousLine("previous line", "")).toStrictEqual([
			"previous line",
			13,
		]);
	});
	it("line with space suffix, empty previous line", () => {
		expect(joinPreviousLine("previous line         ", "")).toStrictEqual([
			"previous line",
			13,
		]);
	});

	it("line with prefix and a suffix, empty previous line", () => {
		expect(joinPreviousLine("   previous line         ", "")).toStrictEqual(
			["   previous line", 16]
		);
	});

	it("line with space suffix, current line", () => {
		expect(
			joinPreviousLine("previous line         ", "current line")
		).toStrictEqual(["previous line current line", 14]);
	});

	it("line with prefix and a suffix, current line", () => {
		expect(
			joinPreviousLine("   previous line         ", "current line")
		).toStrictEqual(["   previous line current line", 17]);
	});

	it("line with prefix and a suffix, current line with prefix and a suffix", () => {
		expect(
			joinPreviousLine(
				"   previous line         ",
				"    current line    "
			)
		).toStrictEqual(["   previous line current line", 17]);
	});

	it("order list line, next order list line", () => {
		expect(
			joinPreviousLine("1. previous line", "2. current line")
		).toStrictEqual(["1. previous line current line", 17]);
	});

	it("order list line, next order list line", () => {
		expect(
			joinPreviousLine("1. previous line", "  1. current line")
		).toStrictEqual(["1. previous line current line", 17]);
	});
	it("indented order list line, next order list line", () => {
		const s = "  ";
		expect(
			joinPreviousLine("  1. previous line", "     1. current line")
		).toStrictEqual([`${s}1. previous line current line`, 19]);
	});

	it("bullet list line, next bullet list line", () => {
		expect(
			joinPreviousLine("- previous line", "- current line")
		).toStrictEqual([
			dedent`
			- previous line current line
			`,
			16,
		]);
	});

	it("bullet list line, next indent bullet list line", () => {
		expect(
			joinPreviousLine("- previous line", "  - current line")
		).toStrictEqual(["- previous line current line", 16]);
	});
	it("indented bullet list line, next lower indented bullet list", () => {
		const s = "  ";
		expect(
			joinPreviousLine(`${s}- previous line`, `${s}${s}- current line`)
		).toStrictEqual([`${s}- previous line current line`, 18]);
	});
});
