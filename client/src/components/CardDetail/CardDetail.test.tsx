import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardDetail from "./CardDetail";
import { type UserLibraryDataType } from "@lucid/types";

const mockGame: UserLibraryDataType = {
    _id: "507f1f77bcf86cd799439011",
    user_id: "507f1f77bcf86cd799439012",
    title: "The Last of Us",
    genre: "action",
    platform: "PlayStation 5",
    status: "playing",
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

const renderCardDetail = (overrides: Partial<Parameters<typeof CardDetail>[0]> = {}) =>
    render(
        <CardDetail
            data={mockGame}
            handleOnDeleteById={vi.fn()}
            onPatchGame={vi.fn().mockResolvedValue(mockGame)}
            onClose={vi.fn()}
            {...overrides}
        />,
    );

describe("CardDetail", () => {
    describe("rendering", () => {
        it("renders the game title", () => {
            renderCardDetail();
            expect(screen.getByText("The Last of Us")).toBeInTheDocument();
        });

        it("renders the close button", () => {
            renderCardDetail();
            expect(screen.getByRole("button", { name: "close card detail" })).toBeInTheDocument();
        });

        it("does not apply the closing class initially", () => {
            const { container } = renderCardDetail();
            expect(
                container.querySelector(".card-detail__container--closing"),
            ).not.toBeInTheDocument();
        });

        it("renders the Edit button in view mode", () => {
            renderCardDetail();
            expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        });

        it("renders the Remove button in view mode", () => {
            renderCardDetail();
            expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
        });
    });

    describe("closing", () => {
        it("applies the closing class when close button is clicked", async () => {
            const { container } = renderCardDetail();
            await userEvent.click(screen.getByRole("button", { name: "close card detail" }));
            expect(container.querySelector(".card-detail__container--closing")).toBeInTheDocument();
        });

        it("applies the closing class when isExternallyClosing changes to true", () => {
            const { container, rerender } = renderCardDetail({ isExternallyClosing: false });
            rerender(
                <CardDetail
                    data={mockGame}
                    handleOnDeleteById={vi.fn()}
                    onPatchGame={vi.fn().mockResolvedValue(mockGame)}
                    onClose={vi.fn()}
                    isExternallyClosing={true}
                />,
            );
            expect(container.querySelector(".card-detail__container--closing")).toBeInTheDocument();
        });
    });

    describe("edit mode", () => {
        it("switches to edit mode when Edit is clicked", async () => {
            renderCardDetail();
            await userEvent.click(screen.getByRole("button", { name: "Edit" }));
            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        });

        it("returns to view mode when Cancel is clicked", async () => {
            renderCardDetail();
            await userEvent.click(screen.getByRole("button", { name: "Edit" }));
            await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
            expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
            expect(screen.getByText("The Last of Us")).toBeInTheDocument();
        });

        it("calls onPatchGame when the edit form is submitted", async () => {
            const onPatchGame = vi.fn().mockResolvedValue(mockGame);
            renderCardDetail({ onPatchGame });
            await userEvent.click(screen.getByRole("button", { name: "Edit" }));
            await userEvent.click(screen.getByRole("button", { name: "Submit" }));
            expect(onPatchGame).toHaveBeenCalledOnce();
        });
    });
});
