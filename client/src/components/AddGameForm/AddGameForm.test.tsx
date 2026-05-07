import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddGameForm from "./AddGameForm";

describe("AddGameForm", () => {
    it("renders the Add Game submit button", () => {
        render(<AddGameForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
        expect(screen.getByRole("button", { name: "Add Game" })).toBeInTheDocument();
    });

    it("calls onCancel when the cancel button is clicked", async () => {
        const handleCancel = vi.fn();
        render(<AddGameForm onSubmit={vi.fn()} onCancel={handleCancel} />);
        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(handleCancel).toHaveBeenCalledOnce();
    });

    it("does not call onSubmit when title is empty", async () => {
        const handleSubmit = vi.fn();
        render(<AddGameForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
        await userEvent.click(screen.getByRole("button", { name: "Add Game" }));
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit with the correct data when title is filled", async () => {
        const handleSubmit = vi.fn();
        render(<AddGameForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
        await userEvent.type(screen.getByLabelText("Title"), "Halo");
        await userEvent.click(screen.getByRole("button", { name: "Add Game" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
        expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Halo" }),
        );
    });
});
