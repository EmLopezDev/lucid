import { describe, it, expect } from "vitest";
import { formatDate, toInputDate, formatShortDate, formatMonthYear } from "./date";

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

describe("formatShortDate", () => {
    it("formats an ISO date to short month and day", () => {
        expect(formatShortDate("2024-05-15T12:00:00.000Z")).toBe("May 15");
    });

    it("omits leading zero on single-digit day", () => {
        expect(formatShortDate("2024-01-05T12:00:00.000Z")).toBe("Jan 5");
    });

    it("formats a year boundary date correctly", () => {
        expect(formatShortDate("2023-12-31T12:00:00.000Z")).toBe("Dec 31");
    });
});

describe("formatMonthYear", () => {
    it("formats an ISO date to short month and full year", () => {
        expect(formatMonthYear("2024-05-15T12:00:00.000Z")).toBe("May 2024");
    });

    it("formats a date in a different month and year", () => {
        expect(formatMonthYear("2023-12-01T12:00:00.000Z")).toBe("Dec 2023");
    });

    it("formats January correctly", () => {
        expect(formatMonthYear("2025-01-20T12:00:00.000Z")).toBe("Jan 2025");
    });
});
