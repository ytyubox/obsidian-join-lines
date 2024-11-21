test("adds 1 + 2 to equal 3", () => {
	// Arrange
	let x: number = 2,
		y: number = 2;
	let expected: number = 4;

	// Act
	let actual: number = x + y;

	// Assert
	expect(actual).toBe(expected);
});
