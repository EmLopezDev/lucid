import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

const mockGame = {
    _id: "507f1f77bcf86cd799439011",
    user_id: "507f1f77bcf86cd799439012",
    title: "The Last of Us",
    genre: "action adventure" as const,
    platform: "playstation" as const,
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
};

const defaultProps = {
    data: mockGame,
    selectedId: "",
    handleCardSelect: vi.fn(),
    handleDelete: vi.fn(),
};

describe("Card", () => {
    describe("rendering", () => {
        it("renders the game title", () => {
            render(<Card {...defaultProps} />);
            expect(screen.getByText("The Last of Us")).toBeInTheDocument();
        });

        it("renders the genre capitalized", () => {
            render(<Card {...defaultProps} />);
            expect(screen.getByText("Action adventure")).toBeInTheDocument();
        });

        it("renders the platform capitalized", () => {
            render(<Card {...defaultProps} />);
            expect(screen.getByText("Playstation")).toBeInTheDocument();
        });

        it("renders the select button with the correct aria-label", () => {
            render(<Card {...defaultProps} />);
            expect(
                screen.getByRole("button", {
                    name: "The Last of Us, Playing, Action adventure, Playstation",
                }),
            ).toBeInTheDocument();
        });

        it("renders the delete button with the correct aria-label", () => {
            render(<Card {...defaultProps} />);
            expect(
                screen.getByRole("button", { name: "Delete The Last of Us" }),
            ).toBeInTheDocument();
        });

        it("shows price with $ prefix", () => {
            render(<Card {...defaultProps} />);
            expect(screen.getByText("$59.99")).toBeInTheDocument();
        });

        it("shows 'Free' when price is '0.00'", () => {
            render(<Card {...defaultProps} data={{ ...mockGame, price: "0.00" }} />);
            expect(screen.getByText("Free")).toBeInTheDocument();
        });

        it("does not render price when price is null", () => {
            render(<Card {...defaultProps} data={{ ...mockGame, price: null }} />);
            expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
            expect(screen.queryByText("Free")).not.toBeInTheDocument();
        });
    });

    describe("selected state", () => {
        it("select button has aria-pressed false when not selected", () => {
            render(<Card {...defaultProps} selectedId="other-id" />);
            expect(
                screen.getByRole("button", {
                    name: "The Last of Us, Playing, Action adventure, Playstation",
                }),
            ).toHaveAttribute("aria-pressed", "false");
        });

        it("select button has aria-pressed true when selected", () => {
            render(<Card {...defaultProps} selectedId={mockGame._id} />);
            expect(
                screen.getByRole("button", {
                    name: "The Last of Us, Playing, Action adventure, Playstation",
                }),
            ).toHaveAttribute("aria-pressed", "true");
        });

        it("applies card__selected class when selected", () => {
            const { container } = render(<Card {...defaultProps} selectedId={mockGame._id} />);
            expect(container.firstChild).toHaveClass("card__selected");
        });

        it("does not apply card__selected class when not selected", () => {
            const { container } = render(<Card {...defaultProps} selectedId="other-id" />);
            expect(container.firstChild).not.toHaveClass("card__selected");
        });
    });

    describe("interaction", () => {
        it("calls handleCardSelect with data._id when select button is clicked", async () => {
            const handleCardSelect = vi.fn();
            render(<Card {...defaultProps} handleCardSelect={handleCardSelect} />);
            await userEvent.click(
                screen.getByRole("button", {
                    name: "The Last of Us, Playing, Action adventure, Playstation",
                }),
            );
            expect(handleCardSelect).toHaveBeenCalledWith(mockGame._id);
        });

        it("calls handleDelete with data._id when delete button is clicked", async () => {
            const handleDelete = vi.fn();
            render(<Card {...defaultProps} handleDelete={handleDelete} />);
            await userEvent.click(screen.getByRole("button", { name: "Delete The Last of Us" }));
            expect(handleDelete).toHaveBeenCalledWith(mockGame._id);
        });
    });
});
