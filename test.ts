import { joinLinesSelectText, joinLinesCursorText } from "./join";

describe("join lines", () => {
	it("empty tree", () => {
		expect(joinLinesSelectText("")).toStrictEqual("");
	});
});
