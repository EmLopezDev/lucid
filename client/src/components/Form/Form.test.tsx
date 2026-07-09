import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";

describe("Form", () => {
    describe("rendering", () => {
        it("renders children", () => {
            render(
                <Form onSubmit={vi.fn()}>
                    <p>Form content</p>
                </Form>,
            );
            expect(screen.getByText("Form content")).toBeInTheDocument();
        });

        it("renders the Submit button by default", () => {
            render(<Form onSubmit={vi.fn()}>content</Form>);
            expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
        });

        it("renders the Cancel button by default", () => {
            render(<Form onSubmit={vi.fn()}>content</Form>);
            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        });

        it("renders a custom primaryButtonText", () => {
            render(
                <Form onSubmit={vi.fn()} primaryButtonText="Add Game">
                    content
                </Form>,
            );
            expect(screen.getByRole("button", { name: "Add Game" })).toBeInTheDocument();
        });

        it("renders a custom secondaryButtonText", () => {
            render(
                <Form onSubmit={vi.fn()} secondaryButtonText="Go Back">
                    content
                </Form>,
            );
            expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
        });

        it("does not render an error when errorText is not provided", () => {
            render(<Form onSubmit={vi.fn()}>content</Form>);
            expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
        });

        it("renders the error message when errorText is provided", () => {
            render(
                <Form onSubmit={vi.fn()} errorText={() => "Something went wrong"}>
                    content
                </Form>,
            );
            expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onSubmit when the form is submitted", async () => {
            const handleSubmit = vi.fn();
            render(<Form onSubmit={handleSubmit}>content</Form>);
            await userEvent.click(screen.getByRole("button", { name: "Submit" }));
            expect(handleSubmit).toHaveBeenCalledOnce();
        });

        it("calls onCancel when the cancel button is clicked", async () => {
            const handleCancel = vi.fn();
            render(
                <Form onSubmit={vi.fn()} onCancel={handleCancel}>
                    content
                </Form>,
            );
            await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
            expect(handleCancel).toHaveBeenCalledOnce();
        });
    });

    describe("primaryButtonDisabled", () => {
        it("disables the submit button when primaryButtonDisabled is true", () => {
            render(
                <Form onSubmit={vi.fn()} primaryButtonDisabled>
                    content
                </Form>,
            );
            expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
        });

        it("does not disable the submit button by default", () => {
            render(<Form onSubmit={vi.fn()}>content</Form>);
            expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
        });
    });

    describe("loading state", () => {
        it("disables the submit button when isLoading is true", () => {
            render(
                <Form onSubmit={vi.fn()} isLoading>
                    content
                </Form>,
            );
            expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
        });

        it("disables the cancel button when isLoading is true", () => {
            render(
                <Form onSubmit={vi.fn()} isLoading>
                    content
                </Form>,
            );
            expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
        });

        it("does not disable either button by default", () => {
            render(<Form onSubmit={vi.fn()}>content</Form>);
            expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
            expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
        });

        it("disables form fields when isLoading is true", () => {
            render(
                <Form onSubmit={vi.fn()} isLoading>
                    <input
                        aria-label="Name"
                        type="text"
                    />
                </Form>,
            );
            expect(screen.getByLabelText("Name")).toBeDisabled();
        });

        it("does not disable form fields by default", () => {
            render(
                <Form onSubmit={vi.fn()}>
                    <input
                        aria-label="Name"
                        type="text"
                    />
                </Form>,
            );
            expect(screen.getByLabelText("Name")).not.toBeDisabled();
        });
    });
});
