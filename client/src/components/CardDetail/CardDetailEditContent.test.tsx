import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardDetailEditContent from "./CardDetailEditContent";

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
};

describe("CardDetailEditContent", () => {
    it("pre-fills the title input with the game's title", () => {
        render(
            <CardDetailEditContent
                data={mockGame}
                onSubmit={vi.fn()}
                onCancel={vi.fn()}
            />,
        );
        expect(screen.getByDisplayValue("The Last of Us")).toBeInTheDocument();
    });

    it("calls onCancel when the cancel button is clicked", async () => {
        const handleCancel = vi.fn();
        render(
            <CardDetailEditContent
                data={mockGame}
                onSubmit={vi.fn()}
                onCancel={handleCancel}
            />,
        );
        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(handleCancel).toHaveBeenCalledOnce();
    });

    it("calls onSubmit when the form is submitted", async () => {
        const handleSubmit = vi.fn();
        render(
            <CardDetailEditContent
                data={mockGame}
                onSubmit={handleSubmit}
                onCancel={vi.fn()}
            />,
        );
        await userEvent.click(screen.getByRole("button", { name: "Submit" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });
});
