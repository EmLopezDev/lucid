import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Textarea from "./Textarea";

describe("Textarea", () => {
    describe("rendering", () => {
        it("renders a textbox", () => {
            render(<Textarea onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("applies the medium size class by default", () => {
            render(<Textarea onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toHaveClass("textarea--medium");
        });

        it("applies the given size class", () => {
            render(<Textarea onChange={vi.fn()} textareaSize="large" />);
            expect(screen.getByRole("textbox")).toHaveClass("textarea--large");
        });

        it("renders a label when provided", () => {
            render(<Textarea onChange={vi.fn()} label="Notes" />);
            expect(screen.getByLabelText("Notes")).toBeInTheDocument();
        });

        it("links the label to the textarea via htmlFor", () => {
            render(<Textarea onChange={vi.fn()} label="Notes" id="notes" />);
            expect(screen.getByLabelText("Notes")).toHaveAttribute("id", "notes");
        });

        it("renders a required indicator when required", () => {
            render(<Textarea onChange={vi.fn()} label="Notes" required />);
            expect(screen.getByText("*")).toBeInTheDocument();
        });

        it("does not render a required indicator when not required", () => {
            render(<Textarea onChange={vi.fn()} label="Notes" />);
            expect(screen.queryByText("*")).not.toBeInTheDocument();
        });

        it("defaults to 4 rows", () => {
            render(<Textarea onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
        });
    });

    describe("error state", () => {
        it("renders the error message when errorText is provided", () => {
            render(<Textarea onChange={vi.fn()} errorText="Required field" />);
            expect(screen.getByRole("alert")).toHaveTextContent("Required field");
        });

        it("marks the textarea as invalid when errorText is provided", () => {
            render(<Textarea onChange={vi.fn()} errorText="Required field" />);
            expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        });

        it("does not mark the textarea as invalid when there is no error", () => {
            render(<Textarea onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
        });

        it("does not render the error container when hasErrorText is false", () => {
            render(<Textarea onChange={vi.fn()} hasErrorText={false} />);
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });

    describe("character counter", () => {
        it("does not render a counter when maxCount is not provided", () => {
            render(<Textarea onChange={vi.fn()} value="hello" />);
            expect(screen.queryByText(/\/ /)).not.toBeInTheDocument();
        });

        it("renders the counter showing current / max", () => {
            render(<Textarea onChange={vi.fn()} value="hello" maxCount={100} />);
            expect(screen.getByText("5 / 100")).toBeInTheDocument();
        });

        it("applies the warn class at 90% of maxCount", () => {
            render(<Textarea onChange={vi.fn()} value={"a".repeat(90)} maxCount={100} />);
            expect(screen.getByText("90 / 100")).toHaveClass("textarea__counter--warn");
        });

        it("applies the limit class at maxCount", () => {
            render(<Textarea onChange={vi.fn()} value={"a".repeat(100)} maxCount={100} />);
            expect(screen.getByText("100 / 100")).toHaveClass("textarea__counter--limit");
        });

        it("does not apply the warn class below 90% of maxCount", () => {
            render(<Textarea onChange={vi.fn()} value={"a".repeat(89)} maxCount={100} />);
            expect(screen.getByText("89 / 100")).not.toHaveClass("textarea__counter--warn");
        });

        it("sets maxLength attribute to maxCount", () => {
            render(<Textarea onChange={vi.fn()} maxCount={200} />);
            expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "200");
        });
    });

    describe("interaction", () => {
        it("calls onChange when the user types", async () => {
            const handleChange = vi.fn();
            render(<Textarea onChange={handleChange} />);
            await userEvent.type(screen.getByRole("textbox"), "hello");
            expect(handleChange).toHaveBeenCalledTimes(5);
        });

        it("is disabled when the disabled prop is set", () => {
            render(<Textarea onChange={vi.fn()} disabled />);
            expect(screen.getByRole("textbox")).toBeDisabled();
        });
    });
});
