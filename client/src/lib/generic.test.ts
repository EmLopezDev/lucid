import { describe, it, expect } from "vitest";
import { objectCopy } from "./generic";

describe("objectCopy", () => {
    it("returns a new object with the same properties", () => {
        const original = { a: 1, b: "hello" };
        const copy = objectCopy(original);
        expect(copy).toEqual(original);
    });

    it("returns a different reference from the original", () => {
        const original = { a: 1 };
        const copy = objectCopy(original);
        expect(copy).not.toBe(original);
    });

    it("mutations to the copy do not affect the original", () => {
        const original = { a: 1, b: 2 };
        const copy = objectCopy(original);
        (copy as { a: number }).a = 99;
        expect(original.a).toBe(1);
    });
});
