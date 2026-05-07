import { describe, it, expect } from "vitest";
import { formatDate, toInputDate } from "./date";

describe("formatDate", () => {
    it("formats an ISO date string to a readable date", () => {
        expect(formatDate("2024-05-15T12:00:00.000Z")).toBe("May 15, 2024");
    });

    it("formats a date with a single-digit day", () => {
        expect(formatDate("2024-01-05T12:00:00.000Z")).toBe("Jan 5, 2024");
    });

    it("returns an empty string for an empty input", () => {
        expect(formatDate("")).toBe("");
    });
});

describe("toInputDate", () => {
    it("converts an ISO string to YYYY-MM-DD format", () => {
        expect(toInputDate("2024-05-15T00:00:00.000Z")).toBe("2024-05-15");
    });

    it("pads single-digit month and day with a leading zero", () => {
        expect(toInputDate("2024-01-05T00:00:00.000Z")).toBe("2024-01-05");
    });

    it("handles a date-only ISO string", () => {
        expect(toInputDate("2024-05-15")).toBe("2024-05-15");
    });
});
