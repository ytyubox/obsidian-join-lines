import { joinLinesSelectText, joinLinesCursorText } from "./join";

describe("join lines", () => {
	it("empty select", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
});
