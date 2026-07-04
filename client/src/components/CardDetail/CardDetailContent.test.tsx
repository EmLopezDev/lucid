import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardDetailContent from "./CardDetailContent";

const mockGame = {
    _id: "507f1f77bcf86cd799439011",
    user_id: "507f1f77bcf86cd799439012",
    title: "The Last of Us",
    genre: "action" as const,
    platform: "PlayStation 5" as const,
    status: "playing" as const,
    favorite: false,
    price: "59.99",
    date_purchased: "2024-01-15",
    date_played: null,
    hours_played: 25,
    rating: 4.5,
    comment: "Great game!",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: null,
    deleted_at: null,
    cover_url: null,
    played_with_club: null,
};

const defaultProps = {
    data: mockGame,
    setEditMode: vi.fn(),
    handleOnDeleteById: vi.fn(),
};

describe("CardDetailContent", () => {
    describe("rendering", () => {
        it("renders the game title", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText("The Last of Us")).toBeInTheDocument();
        });

        it("renders the genre and platform capitalized", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText("Action")).toBeInTheDocument();
            expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
        });

        it("renders the status badge", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText("Playing")).toBeInTheDocument();
        });

        it("renders price with $ prefix", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText("$59.99")).toBeInTheDocument();
        });

        it("shows 'Free' when price is '0.00'", () => {
            render(
                <CardDetailContent
                    {...defaultProps}
                    data={{ ...mockGame, price: "0.00" }}
                />,
            );
            expect(screen.getByText("Free")).toBeInTheDocument();
        });

        it("shows '-' when price is null", () => {
            render(
                <CardDetailContent
                    {...defaultProps}
                    data={{ ...mockGame, price: null }}
                />,
            );
            const priceStats = screen.getAllByText("-");
            expect(priceStats.length).toBeGreaterThan(0);
        });

        it("renders the year from date_purchased", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText(/2024/)).toBeInTheDocument();
        });

        it("shows '-' when date_purchased is null", () => {
            render(
                <CardDetailContent
                    {...defaultProps}
                    data={{ ...mockGame, date_purchased: null }}
                />,
            );
            const dashes = screen.getAllByText("-");
            expect(dashes.length).toBeGreaterThan(0);
        });

        it("renders hours_played value", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText("25")).toBeInTheDocument();
        });

        it("shows '-' when hours_played is null", () => {
            render(
                <CardDetailContent
                    {...defaultProps}
                    data={{ ...mockGame, hours_played: null }}
                />,
            );
            const dashes = screen.getAllByText("-");
            expect(dashes.length).toBeGreaterThan(0);
        });

        it("renders the comment text", () => {
            render(<CardDetailContent {...defaultProps} />);
            expect(screen.getByText("Great game!")).toBeInTheDocument();
        });

        it("shows 'No comments added yet.' when comment is null", () => {
            render(
                <CardDetailContent
                    {...defaultProps}
                    data={{ ...mockGame, comment: null }}
                />,
            );
            expect(screen.getByText("No comments added yet.")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls setEditMode(true) when Edit button is clicked", async () => {
            const setEditMode = vi.fn();
            render(
                <CardDetailContent
                    {...defaultProps}
                    setEditMode={setEditMode}
                />,
            );
            await userEvent.click(screen.getByRole("button", { name: "Edit" }));
            expect(setEditMode).toHaveBeenCalledWith(true);
        });

        it("calls handleOnDeleteById with data._id when Remove button is clicked", async () => {
            const handleOnDeleteById = vi.fn();
            render(
                <CardDetailContent
                    {...defaultProps}
                    handleOnDeleteById={handleOnDeleteById}
                />,
            );
            await userEvent.click(screen.getByRole("button", { name: "Remove" }));
            expect(handleOnDeleteById).toHaveBeenCalledWith(mockGame._id);
        });
    });
});
