import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RecentGames from "./RecentGames";
import { type UserLibraryDataType } from "@lucid/types";

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

const renderComponent = (games: UserLibraryDataType[]) =>
    render(
        <MemoryRouter>
            <RecentGames games={games} />
        </MemoryRouter>,
    );

describe("RecentGames", () => {
    describe("empty state", () => {
        it("renders nothing when games array is empty", () => {
            const { container } = renderComponent([]);
            expect(container).toBeEmptyDOMElement();
        });
    });

    describe("rendering", () => {
        it("renders the section title", () => {
            renderComponent([makeGame()]);
            expect(screen.getByText("Recently Added")).toBeInTheDocument();
        });

        it("renders a card for each game", () => {
            const games = [
                makeGame({ _id: "1", title: "Game One" }),
                makeGame({ _id: "2", title: "Game Two" }),
                makeGame({ _id: "3", title: "Game Three" }),
            ];
            renderComponent(games);
            expect(screen.getByText("Game One")).toBeInTheDocument();
            expect(screen.getByText("Game Two")).toBeInTheDocument();
            expect(screen.getByText("Game Three")).toBeInTheDocument();
        });

        it("renders the platform when set", () => {
            renderComponent([makeGame({ platform: "PlayStation 5" })]);
            expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
        });

        it("does not render platform text when platform is null", () => {
            renderComponent([makeGame({ title: "Solo Game", platform: null })]);
            expect(screen.queryByText("PC")).not.toBeInTheDocument();
        });

        it("renders a cover image when cover_url is set", () => {
            const { container } = renderComponent([
                makeGame({ cover_url: "https://example.com/cover.jpg" }),
            ]);
            const img = container.querySelector("img");
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute("src", "https://example.com/cover.jpg");
        });

        it("does not render a cover image when cover_url is null", () => {
            const { container } = renderComponent([makeGame({ cover_url: null })]);
            expect(container.querySelector("img")).not.toBeInTheDocument();
        });
    });

    describe("status modifier class", () => {
        it.each([
            ["playing"],
            ["completed"],
            ["wishlist"],
            ["paused"],
            ["dropped"],
        ] as const)(
            "applies recent-game-card--%s class for %s status",
            (status) => {
                const { container } = renderComponent([makeGame({ status })]);
                expect(
                    container.querySelector(`.recent-game-card--${status}`),
                ).toBeInTheDocument();
            },
        );

        it("does not apply any status modifier class when status is null", () => {
            const { container } = renderComponent([makeGame({ status: null })]);
            const statuses = ["playing", "completed", "wishlist", "paused", "dropped"];
            statuses.forEach((s) => {
                expect(
                    container.querySelector(`.recent-game-card--${s}`),
                ).not.toBeInTheDocument();
            });
        });
    });

    describe("accessibility", () => {
        it("each card links to /user/library", () => {
            renderComponent([makeGame({ title: "Zelda" })]);
            const link = screen.getByRole("link", { name: /Zelda/i });
            expect(link).toHaveAttribute("href", "/user/library");
        });

        it("aria-label includes the capitalised status when set", () => {
            renderComponent([makeGame({ title: "Zelda", status: "playing" })]);
            expect(screen.getByRole("link", { name: "Zelda, Playing" })).toBeInTheDocument();
        });

        it("aria-label is just the title when status is null", () => {
            renderComponent([makeGame({ title: "Zelda", status: null })]);
            expect(screen.getByRole("link", { name: "Zelda" })).toBeInTheDocument();
        });
    });
});
