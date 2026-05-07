import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input", () => {
    describe("rendering", () => {
        it("renders an input element", () => {
            render(<Input onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("applies the medium size class by default", () => {
            render(<Input onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toHaveClass("input--medium");
        });

        it("applies the given size class", () => {
            render(<Input onChange={vi.fn()} inputSize="large" />);
            expect(screen.getByRole("textbox")).toHaveClass("input--large");
        });

        it("renders a label when provided", () => {
            render(<Input onChange={vi.fn()} label="Email" />);
            expect(screen.getByLabelText("Email")).toBeInTheDocument();
        });

        it("does not render a label when not provided", () => {
            render(<Input onChange={vi.fn()} />);
            expect(screen.queryByRole("label")).not.toBeInTheDocument();
        });

        it("links the label to the input via htmlFor", () => {
            render(<Input onChange={vi.fn()} label="Email" id="email" />);
            expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
        });

        it("renders a required indicator when required", () => {
            render(<Input onChange={vi.fn()} label="Email" required />);
            expect(screen.getByText("*")).toBeInTheDocument();
        });

        it("does not render a required indicator when not required", () => {
            render(<Input onChange={vi.fn()} label="Email" />);
            expect(screen.queryByText("*")).not.toBeInTheDocument();
        });
    });

    describe("error state", () => {
        it("renders the error message when errorText is provided", () => {
            render(<Input onChange={vi.fn()} errorText="Required field" />);
            expect(screen.getByRole("alert")).toHaveTextContent("Required field");
        });

        it("marks the input as invalid when errorText is provided", () => {
            render(<Input onChange={vi.fn()} errorText="Required field" />);
            expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        });

        it("does not mark the input as invalid when there is no error", () => {
            render(<Input onChange={vi.fn()} />);
            expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
        });

        it("does not render the error container when hasErrorText is false", () => {
            render(<Input onChange={vi.fn()} hasErrorText={false} />);
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onChange when the user types", async () => {
            const handleChange = vi.fn();
            render(<Input onChange={handleChange} />);
            await userEvent.type(screen.getByRole("textbox"), "hello");
            expect(handleChange).toHaveBeenCalledTimes(5);
        });

        it("reflects typed value", async () => {
            render(<Input onChange={vi.fn()} />);
            await userEvent.type(screen.getByRole("textbox"), "hello");
            expect(screen.getByRole("textbox")).toHaveValue("hello");
        });

        it("is disabled when the disabled prop is set", () => {
            render(<Input onChange={vi.fn()} disabled />);
            expect(screen.getByRole("textbox")).toBeDisabled();
        });
    });
});
