import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./debounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebounce", () => {
    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("hello", 500));
        expect(result.current).toBe("hello");
    });

    it("does not update the value before the delay elapses", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: "hello" },
        });

        rerender({ value: "world" });
        act(() => vi.advanceTimersByTime(499));

        expect(result.current).toBe("hello");
    });

    it("updates the value after the delay elapses", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: "hello" },
        });

        rerender({ value: "world" });
        act(() => vi.advanceTimersByTime(500));

        expect(result.current).toBe("world");
    });

    it("resets the timer when the value changes before the delay", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: "hello" },
        });

        rerender({ value: "wor" });
        act(() => vi.advanceTimersByTime(300));

        rerender({ value: "world" });
        act(() => vi.advanceTimersByTime(300));

        // 300ms after last change — not yet debounced
        expect(result.current).toBe("hello");

        act(() => vi.advanceTimersByTime(200));

        // 500ms after last change — now debounced
        expect(result.current).toBe("world");
    });

    it("uses 800ms as the default delay", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
            initialProps: { value: "hello" },
        });

        rerender({ value: "world" });
        act(() => vi.advanceTimersByTime(799));
        expect(result.current).toBe("hello");

        act(() => vi.advanceTimersByTime(1));
        expect(result.current).toBe("world");
    });
});
