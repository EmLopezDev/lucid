import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRecentGames } from "./useRecentGames";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

let mockLibraryData: UserLibraryDataType[] = [];

vi.mock("../../contexts/UserLibraryContext/useUserLibraryContext", () => ({
    useUserLibraryContext: () => ({ libraryData: mockLibraryData }),
}));

function makeGame(overrides: Partial<UserLibraryDataType> = {}): UserLibraryDataType {
    return {
        _id: "1",
        title: "Test Game",
        status: "playing",
        genre: "action",
        platform: "PC",
        rating: null,
        user_id: "user-1",
        favorite: false,
        date_played: null,
        date_purchased: null,
        hours_played: null,
        comment: null,
        price: null,
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: null,
        deleted_at: null,
        cover_url: null,
        ...overrides,
    };
}

describe("useRecentGames", () => {
    beforeEach(() => {
        mockLibraryData = [];
    });

    it("returns an empty array when the library is empty", () => {
        const { result } = renderHook(() => useRecentGames());
        expect(result.current).toEqual([]);
    });

    it("sorts games by created_at descending — most recent first", () => {
        mockLibraryData = [
            makeGame({ _id: "1", title: "Oldest", created_at: "2024-01-01T00:00:00.000Z" }),
            makeGame({ _id: "2", title: "Newest", created_at: "2024-12-01T00:00:00.000Z" }),
            makeGame({ _id: "3", title: "Middle", created_at: "2024-06-01T00:00:00.000Z" }),
        ];
        const { result } = renderHook(() => useRecentGames());
        expect(result.current[0].title).toBe("Newest");
        expect(result.current[1].title).toBe("Middle");
        expect(result.current[2].title).toBe("Oldest");
    });

    it("returns at most 6 games by default", () => {
        mockLibraryData = Array.from({ length: 10 }, (_, i) =>
            makeGame({
                _id: String(i),
                title: `Game ${i}`,
                created_at: `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`,
            }),
        );
        const { result } = renderHook(() => useRecentGames());
        expect(result.current).toHaveLength(6);
    });

    it("respects a custom limit", () => {
        mockLibraryData = Array.from({ length: 10 }, (_, i) =>
            makeGame({ _id: String(i), title: `Game ${i}` }),
        );
        const { result } = renderHook(() => useRecentGames(3));
        expect(result.current).toHaveLength(3);
    });

    it("returns all games when library has fewer than the limit", () => {
        mockLibraryData = [
            makeGame({ _id: "1", title: "Only Game" }),
        ];
        const { result } = renderHook(() => useRecentGames());
        expect(result.current).toHaveLength(1);
    });

    it("does not mutate the original libraryData array order", () => {
        mockLibraryData = [
            makeGame({ _id: "1", title: "Oldest", created_at: "2024-01-01T00:00:00.000Z" }),
            makeGame({ _id: "2", title: "Newest", created_at: "2024-12-01T00:00:00.000Z" }),
        ];
        renderHook(() => useRecentGames());
        expect(mockLibraryData[0].title).toBe("Oldest");
        expect(mockLibraryData[1].title).toBe("Newest");
    });
});
