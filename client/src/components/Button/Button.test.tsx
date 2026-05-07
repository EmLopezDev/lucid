import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
    describe("rendering", () => {
        it("renders text content", () => {
            render(<Button>Save</Button>);
            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        });

        it("defaults to type=button", () => {
            render(<Button>Save</Button>);
            expect(screen.getByRole("button")).toHaveAttribute("type", "button");
        });

        it("applies the primary variant class by default", () => {
            render(<Button>Save</Button>);
            expect(screen.getByRole("button")).toHaveClass("button--primary");
        });

        it("applies the medium size class by default", () => {
            render(<Button>Save</Button>);
            expect(screen.getByRole("button")).toHaveClass("button--medium");
        });

        it("applies the given variant class", () => {
            render(<Button variant="danger">Delete</Button>);
            expect(screen.getByRole("button")).toHaveClass("button--danger");
        });

        it("applies the given size class", () => {
            render(<Button buttonSize="small">Save</Button>);
            expect(screen.getByRole("button")).toHaveClass("button--small");
        });

        it("passes through the submit type", () => {
            render(<Button type="submit">Submit</Button>);
            expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
        });
    });

    describe("icon-only", () => {
        it("applies the icon-only class when only an icon is given", () => {
            render(<Button icon="plus" />);
            expect(screen.getByRole("button")).toHaveClass("button--icon-only");
        });

        it("does not apply the icon-only class when icon and text are given", () => {
            render(<Button icon="plus">Add</Button>);
            expect(screen.getByRole("button")).not.toHaveClass("button--icon-only");
        });
    });

    describe("icon position", () => {
        it("renders icon before text when iconPosition is left", () => {
            render(<Button icon="plus" iconPosition="left">Add</Button>);
            const button = screen.getByRole("button");
            const spans = button.querySelectorAll("span");
            expect(spans[0]).toContainElement(button.querySelector("svg"));
        });

        it("renders text before icon when iconPosition is right", () => {
            render(<Button icon="plus" iconPosition="right">Add</Button>);
            const button = screen.getByRole("button");
            expect(button.lastChild).toContainElement(button.querySelector("svg"));
        });
    });

    describe("interaction", () => {
        it("calls onClick when clicked", async () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Save</Button>);
            await userEvent.click(screen.getByRole("button"));
            expect(handleClick).toHaveBeenCalledOnce();
        });

        it("does not call onClick when disabled", async () => {
            const handleClick = vi.fn();
            render(<Button disabled onClick={handleClick}>Save</Button>);
            await userEvent.click(screen.getByRole("button"));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it("is disabled when the disabled prop is set", () => {
            render(<Button disabled>Save</Button>);
            expect(screen.getByRole("button")).toBeDisabled();
        });
    });
});
