import { joinLinesSelectText, joinLinesCursorText } from "./join";

describe("join selected lines", () => {
	it("empty select", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
	it("1 line selection", () => {
		expect(joinLinesSelectText("line 1")).toStrictEqual("line 1");
	});
	it("2 line selection", () => {
		expect(
			joinLinesSelectText(
				`line 1
line 2`
			)
		).toStrictEqual("line 1 line 2");
	});
});
