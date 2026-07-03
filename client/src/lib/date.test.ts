import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDate, toInputDate, formatShortDate, formatMonthYear, formatRelativeTime } from "./date";

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

describe("formatRelativeTime", () => {
    const NOW = new Date("2025-06-15T12:00:00.000Z").getTime();

    beforeEach(() => vi.setSystemTime(NOW));
    afterEach(() => vi.useRealTimers());

    it("returns 'just now' for posts under a minute old", () => {
        expect(formatRelativeTime(new Date(NOW - 30_000).toISOString())).toBe("just now");
    });

    it("returns singular 'minute ago' for exactly 1 minute", () => {
        expect(formatRelativeTime(new Date(NOW - 60_000).toISOString())).toBe("1 minute ago");
    });

    it("returns plural 'minutes ago' for multiple minutes", () => {
        expect(formatRelativeTime(new Date(NOW - 5 * 60_000).toISOString())).toBe("5 minutes ago");
    });

    it("returns singular 'hour ago' for exactly 1 hour", () => {
        expect(formatRelativeTime(new Date(NOW - 3_600_000).toISOString())).toBe("1 hour ago");
    });

    it("returns plural 'hours ago' for multiple hours", () => {
        expect(formatRelativeTime(new Date(NOW - 3 * 3_600_000).toISOString())).toBe("3 hours ago");
    });

    it("returns singular 'day ago' for exactly 1 day", () => {
        expect(formatRelativeTime(new Date(NOW - 86_400_000).toISOString())).toBe("1 day ago");
    });

    it("returns plural 'days ago' within the 7-day window", () => {
        expect(formatRelativeTime(new Date(NOW - 4 * 86_400_000).toISOString())).toBe("4 days ago");
    });

    it("returns an absolute date for posts 7 or more days old", () => {
        expect(formatRelativeTime(new Date(NOW - 7 * 86_400_000).toISOString())).toBe("Jun 8, 2025");
    });

    it("returns an absolute date for much older posts", () => {
        expect(formatRelativeTime("2024-01-10T12:00:00.000Z")).toBe("Jan 10, 2024");
    });
});
