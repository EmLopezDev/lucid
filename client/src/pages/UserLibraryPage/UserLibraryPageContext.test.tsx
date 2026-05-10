import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { UserLibraryPageProvider } from "./UserLibraryPageContext";
import { useUserLibraryPageContext } from "./useUserLibraryPageContext";
import { UserLibraryProvider } from "../../contexts/UserLibraryContext/UserLibraryContext";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

const mockCurrentUser = { _id: "user-1", first_name: "John", last_name: "Doe" };

vi.mock("../../contexts/UserContext/useUserContext", () => ({
    useUserContext: () => ({ currentUser: mockCurrentUser }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <UserLibraryProvider>
        <UserLibraryPageProvider>{children}</UserLibraryPageProvider>
    </UserLibraryProvider>
);

function makeGame(overrides: Partial<UserLibraryDataType> = {}): UserLibraryDataType {
    return {
        _id: "1",
        title: "Test Game",
        status: "playing",
        genre: "action adventure",
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

const games: UserLibraryDataType[] = [
    makeGame({
        _id: "1",
        title: "Zelda",
        status: "playing",
        created_at: "2024-03-01T00:00:00.000Z",
    }),
    makeGame({
        _id: "2",
        title: "Elden Ring",
        status: "completed",
        created_at: "2024-01-01T00:00:00.000Z",
    }),
    makeGame({ _id: "3", title: "Halo", status: "paused", created_at: "2024-02-01T00:00:00.000Z" }),
];

function mockFetchGames(data = games) {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => data,
    });
}

async function setupHook() {
    mockFetchGames();
    const rendered = renderHook(() => useUserLibraryPageContext(), { wrapper });
    await waitFor(() => expect(rendered.result.current.isLoading).toBe(false));
    return rendered.result;
}

describe("UserLibraryPageContext", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    describe("initial data fetch", () => {
        it("starts loading and resolves with library data", async () => {
            mockFetchGames();
            const { result } = renderHook(() => useUserLibraryPageContext(), { wrapper });
            expect(result.current.isLoading).toBe(true);
            await waitFor(() => expect(result.current.isLoading).toBe(false));
            expect(result.current.filteredData).toHaveLength(3);
        });

        it("calls the correct endpoint for the current user", async () => {
            mockFetchGames();
            renderHook(() => useUserLibraryPageContext(), { wrapper });
            await waitFor(() =>
                expect(globalThis.fetch).toHaveBeenCalledWith(
                    expect.stringContaining(`/user/${mockCurrentUser._id}/library`),
                    expect.objectContaining({ credentials: "include" }),
                ),
            );
        });
    });

    describe("filtering", () => {
        it("filters games by title prefix (case-insensitive)", async () => {
            const result = await setupHook();
            act(() =>
                result.current.onSearchTitle({
                    target: { value: "zel" },
                } as React.ChangeEvent<HTMLInputElement>),
            );
            expect(result.current.filteredData).toHaveLength(1);
            expect(result.current.filteredData[0].title).toBe("Zelda");
        });

        it("filters games by status", async () => {
            const result = await setupHook();
            act(() => result.current.onStatusSelect({ value: "completed", label: "completed" }));
            expect(result.current.filteredData).toHaveLength(1);
            expect(result.current.filteredData[0].title).toBe("Elden Ring");
        });

        it("returns all games when status is reset to 'all'", async () => {
            const result = await setupHook();
            act(() => result.current.onStatusSelect({ value: "playing", label: "playing" }));
            act(() => result.current.onStatusSelect({ value: "all", label: "all" }));
            expect(result.current.filteredData).toHaveLength(3);
        });

        it("clears selectedCard when the title filter changes", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            expect(result.current.selectedCard?._id).toBe("1");
            act(() =>
                result.current.onSearchTitle({
                    target: { value: "el" },
                } as React.ChangeEvent<HTMLInputElement>),
            );
            expect(result.current.selectedCard).toBeNull();
        });

        it("clears selectedCard when the status filter changes", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            act(() => result.current.onStatusSelect({ value: "completed", label: "completed" }));
            expect(result.current.selectedCard).toBeNull();
        });

        it("clears selectedCard when the sort filter changes", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            act(() => result.current.onSortSelect({ value: "alphabetical", label: "Title A-Z" }));
            expect(result.current.selectedCard).toBeNull();
        });
    });

    describe("statusCounts", () => {
        it("counts games per status and includes an 'all' total", async () => {
            const result = await setupHook();
            expect(result.current.statusCounts.all).toBe(3);
            expect(result.current.statusCounts.playing).toBe(1);
            expect(result.current.statusCounts.completed).toBe(1);
            expect(result.current.statusCounts.paused).toBe(1);
        });
    });

    describe("card selection", () => {
        it("sets selectedCard when a card is selected", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            expect(result.current.selectedCard?._id).toBe("1");
        });

        it("sets isDetailClosing when the same card is selected again (deselect)", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            await act(async () => result.current.onCardSelect("1"));
            expect(result.current.isDetailClosing).toBe(true);
        });

        it("switches to a different card without closing", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            await act(async () => result.current.onCardSelect("2"));
            expect(result.current.selectedCard?._id).toBe("2");
            expect(result.current.isDetailClosing).toBe(false);
        });

        it("clears selectedCard and isDetailClosing via onCloseCardDetail", async () => {
            const result = await setupHook();
            await act(async () => result.current.onCardSelect("1"));
            act(() => result.current.onCloseCardDetail());
            expect(result.current.selectedCard).toBeNull();
            expect(result.current.isDetailClosing).toBe(false);
        });
    });

    describe("onDeleteGameById", () => {
        it("removes the deleted game from the library", async () => {
            const result = await setupHook();
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            await act(async () => result.current.handleOnDeleteGameById("1"));
            expect(result.current.filteredData.find((g) => g._id === "1")).toBeUndefined();
            expect(result.current.filteredData).toHaveLength(2);
        });

        it("clears selectedCard after deletion", async () => {
            const result = await setupHook();
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            await act(async () => result.current.onCardSelect("1"));
            await act(async () => result.current.handleOnDeleteGameById("1"));
            expect(result.current.selectedCard).toBeNull();
        });

        it("calls the correct DELETE endpoint", async () => {
            const result = await setupHook();
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            await act(async () => result.current.handleOnDeleteGameById("1"));
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/user/${mockCurrentUser._id}/library/1`),
                expect.objectContaining({ method: "DELETE" }),
            );
        });
    });

    describe("onAddGame", () => {
        it("adds the new game to the library", async () => {
            const result = await setupHook();
            const newGame = makeGame({
                _id: "99",
                title: "New Game",
                created_at: "2025-01-01T00:00:00.000Z",
            });
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => newGame,
            });
            await act(async () =>
                result.current.handleOnAddGame({
                    title: "New Game",
                    status: "playing",
                    genre: "other",
                    platform: "PC",
                    favorite: false,
                    date_played: null,
                    date_purchased: null,
                    hours_played: null,
                    rating: null,
                    comment: null,
                    price: null,
                    cover_url: null,
                }),
            );
            expect(result.current.filteredData[0]._id).toBe("99");
            expect(result.current.filteredData).toHaveLength(4);
        });

        it("closes the add game modal after adding", async () => {
            const result = await setupHook();
            const newGame = makeGame({ _id: "99", title: "New Game" });
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => newGame,
            });
            act(() => result.current.onOpenAddGameModal());
            expect(result.current.isAddGameModalOpen).toBe(true);
            await act(async () =>
                result.current.handleOnAddGame({
                    title: "New Game",
                    status: "playing",
                    genre: "other",
                    platform: "PC",
                    favorite: false,
                    date_played: null,
                    date_purchased: null,
                    hours_played: null,
                    rating: null,
                    comment: null,
                    price: null,
                    cover_url: null,
                }),
            );
            expect(result.current.isAddGameModalOpen).toBe(false);
        });
    });

    describe("onPatchGame", () => {
        it("updates the game in the library and selectedCard", async () => {
            const result = await setupHook();
            const updatedGame = makeGame({ _id: "1", title: "Zelda Updated" });
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => updatedGame,
            });
            await act(async () => result.current.onCardSelect("1"));
            await act(async () =>
                result.current.handleOnPatchGame("1", { title: "Zelda Updated" }),
            );
            const patched = result.current.filteredData.find((g) => g._id === "1");
            expect(patched?.title).toBe("Zelda Updated");
            expect(result.current.selectedCard?.title).toBe("Zelda Updated");
        });

        it("returns the updated game on success", async () => {
            const result = await setupHook();
            const updatedGame = makeGame({ _id: "1", title: "Zelda Updated" });
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => updatedGame,
            });
            let returnValue: unknown;
            await act(async () => {
                returnValue = await result.current.handleOnPatchGame("1", {
                    title: "Zelda Updated",
                });
            });
            expect(returnValue).toEqual(updatedGame);
        });

        it("returns null when the request fails", async () => {
            const result = await setupHook();
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });
            let returnValue: unknown;
            await act(async () => {
                returnValue = await result.current.handleOnPatchGame("1", { title: "Bad" });
            });
            expect(returnValue).toBeNull();
        });
    });

    describe("add game modal", () => {
        it("opens and closes the modal", async () => {
            const result = await setupHook();
            expect(result.current.isAddGameModalOpen).toBe(false);
            act(() => result.current.onOpenAddGameModal());
            expect(result.current.isAddGameModalOpen).toBe(true);
            act(() => result.current.onCloseAddGameModal());
            expect(result.current.isAddGameModalOpen).toBe(false);
        });
    });
});
