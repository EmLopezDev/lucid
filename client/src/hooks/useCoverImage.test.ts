import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCoverImage } from "./useCoverImage";

describe("useCoverImage", () => {
    it("hasImage is false when src is null", () => {
        const { result } = renderHook(() => useCoverImage(null));
        expect(result.current.hasImage).toBe(false);
    });

    it("hasImage is true when src is a valid URL", () => {
        const { result } = renderHook(() => useCoverImage("https://example.com/cover.jpg"));
        expect(result.current.hasImage).toBe(true);
    });

    it("hasImage becomes false after handleError is called", () => {
        const { result } = renderHook(() => useCoverImage("https://example.com/cover.jpg"));
        expect(result.current.hasImage).toBe(true);

        act(() => result.current.handleError());

        expect(result.current.hasImage).toBe(false);
    });

    it("hasImage is restored to true after reset is called", () => {
        const { result } = renderHook(() => useCoverImage("https://example.com/cover.jpg"));

        act(() => result.current.handleError());
        expect(result.current.hasImage).toBe(false);

        act(() => result.current.reset());
        expect(result.current.hasImage).toBe(true);
    });

    it("reset has no effect when src is null", () => {
        const { result } = renderHook(() => useCoverImage(null));

        act(() => result.current.reset());

        expect(result.current.hasImage).toBe(false);
    });
});
