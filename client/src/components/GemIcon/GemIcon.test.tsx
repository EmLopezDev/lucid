import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import GemIcon from "./GemIcon";

describe("GemIcon", () => {
    it("renders an SVG", () => {
        const { container } = render(<GemIcon />);
        expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("is aria-hidden", () => {
        const { container } = render(<GemIcon />);
        expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("defaults to size 20", () => {
        const { container } = render(<GemIcon />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "20");
        expect(svg).toHaveAttribute("height", "20");
    });

    it("applies a custom size", () => {
        const { container } = render(<GemIcon size={32} />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "32");
        expect(svg).toHaveAttribute("height", "32");
    });
});
