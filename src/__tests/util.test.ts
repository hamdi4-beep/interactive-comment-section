function sum(a: number, b: number) {
    return a + b
}

describe('A test suit that covers computational functions', () => {
    it('A test case that covers positive numbers', () => {
        const result = sum(1, 3)
        expect(result).toBe(4)
    })
})