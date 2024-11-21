import { joinLinesSelectText, joinLinesCursorText } from "./join";

describe("join lines", () => {
	it("empty text", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
});
