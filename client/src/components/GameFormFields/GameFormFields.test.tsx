import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameFormFields, { type GameFormData } from "./GameFormFields";
import { genreOptions, platformOptions, statusOptions } from "@lib/form";

const initialValue: GameFormData = {
    title: "",
    genre: genreOptions[0]!,
    platform: platformOptions[0]!,
    status: statusOptions[0]!,
    price: "",
    datePurchased: "",
    hoursPlayed: "",
    rating: "",
    comment: "",
};

describe("GameFormFields", () => {
    describe("rendering", () => {
        it("renders the Title input", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
        });

        it("renders the Genre select", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByText("Genre")).toBeInTheDocument();
        });

        it("renders the Platform select", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByText("Platform")).toBeInTheDocument();
        });

        it("renders the Status select", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByText("Status")).toBeInTheDocument();
        });

        it("renders the Price input", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByLabelText("Price")).toBeInTheDocument();
        });

        it("renders the Purchase Date picker", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByText("Purchase Date")).toBeInTheDocument();
        });

        it("renders the Hours input", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByLabelText("Hours")).toBeInTheDocument();
        });

        it("renders the Rating input", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByLabelText("Rating")).toBeInTheDocument();
        });

        it("renders the Comment textarea", () => {
            render(<GameFormFields value={initialValue} onChange={vi.fn()} />);
            expect(screen.getByLabelText("Comment")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onChange when the title input is changed", async () => {
            const handleChange = vi.fn();
            render(<GameFormFields value={initialValue} onChange={handleChange} />);
            await userEvent.type(screen.getByLabelText("Title"), "Halo");
            expect(handleChange).toHaveBeenCalled();
        });
    });
});
