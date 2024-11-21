import { joinLinesSelectText, joinLinesCursorText } from "./join";

describe("join lines", () => {
	it("empty select", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
	it("1 line selection", () => {
		expect(joinLinesSelectText("abc")).toStrictEqual("abc");
	});
});
