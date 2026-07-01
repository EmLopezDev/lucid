import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckboxInput from "./CheckBoxInput";

describe("CheckboxInput", () => {
    describe("rendering", () => {
        it("renders a checkbox", () => {
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={false}
                    onChange={vi.fn()}
                />,
            );
            expect(screen.getByRole("checkbox")).toBeInTheDocument();
        });

        it("renders the label text", () => {
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={false}
                    onChange={vi.fn()}
                />,
            );
            expect(screen.getByLabelText("Spoiler")).toBeInTheDocument();
        });

        it("links the label to the input via htmlFor", () => {
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={false}
                    onChange={vi.fn()}
                    id="spoiler"
                />,
            );
            expect(screen.getByLabelText("Spoiler")).toHaveAttribute("id", "spoiler");
        });

        it("reflects checked state when true", () => {
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={true}
                    onChange={vi.fn()}
                />,
            );
            expect(screen.getByRole("checkbox")).toBeChecked();
        });

        it("reflects checked state when false", () => {
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={false}
                    onChange={vi.fn()}
                />,
            );
            expect(screen.getByRole("checkbox")).not.toBeChecked();
        });
    });

    describe("interaction", () => {
        it("calls onChange when clicked", async () => {
            const handleChange = vi.fn();
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={false}
                    onChange={handleChange}
                />,
            );
            await userEvent.click(screen.getByRole("checkbox"));
            expect(handleChange).toHaveBeenCalledTimes(1);
        });

        it("calls onChange when the label is clicked", async () => {
            const handleChange = vi.fn();
            render(
                <CheckboxInput
                    label="Spoiler"
                    checked={false}
                    onChange={handleChange}
                />,
            );
            await userEvent.click(screen.getByText("Spoiler"));
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
});
