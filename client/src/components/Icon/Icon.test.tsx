import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Icon from "./Icon";

describe("Icon", () => {
    it("renders a span", () => {
        const { container } = render(<Icon name="plus" />);
        expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("is aria-hidden when no label is given", () => {
        const { container } = render(<Icon name="plus" />);
        expect(container.querySelector("span")).toHaveAttribute("aria-hidden", "true");
    });

    it("has aria-label and role=img when a label is given", () => {
        render(<Icon name="plus" label="Add item" />);
        const icon = screen.getByRole("img", { name: "Add item" });
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("aria-label", "Add item");
    });

    it("does not apply a color class when color is inherit (default)", () => {
        const { container } = render(<Icon name="plus" />);
        const span = container.querySelector("span");
        expect(span?.className).not.toMatch(/icon--/);
    });

    it("applies the color class when color is not inherit", () => {
        const { container } = render(<Icon name="plus" color="primary" />);
        expect(container.querySelector("span")).toHaveClass("icon--primary");
    });

    it("renders the medium size (18px) by default", () => {
        const { container } = render(<Icon name="plus" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "18");
        expect(svg).toHaveAttribute("height", "18");
    });

    it("renders the small size (14px)", () => {
        const { container } = render(<Icon name="plus" size="small" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "14");
        expect(svg).toHaveAttribute("height", "14");
    });

    it("renders the large size (22px)", () => {
        const { container } = render(<Icon name="plus" size="large" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "22");
        expect(svg).toHaveAttribute("height", "22");
    });

    it("renders the x-small size (10px)", () => {
        const { container } = render(<Icon name="plus" size="x-small" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "10");
        expect(svg).toHaveAttribute("height", "10");
    });
});
