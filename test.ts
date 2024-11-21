import { joinLinesSelectText, joinLinesCursorText } from "./join";

describe("join lines", () => {
	it("empty select", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
	it(" select", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
});
