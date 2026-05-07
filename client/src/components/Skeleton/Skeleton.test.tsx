import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
    it("renders a div with the skeleton class", () => {
        const { container } = render(<Skeleton height="1rem" />);
        expect(container.firstChild).toHaveClass("skeleton");
    });

    it("is aria-hidden", () => {
        const { container } = render(<Skeleton height="1rem" />);
        expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });

    it("applies the height style", () => {
        const { container } = render(<Skeleton height="2rem" />);
        expect(container.firstChild).toHaveStyle({ height: "2rem" });
    });

    it("applies the width style when provided", () => {
        const { container } = render(<Skeleton height="1rem" width="50%" />);
        expect(container.firstChild).toHaveStyle({ width: "50%" });
    });

    it("applies the borderRadius style when provided", () => {
        const { container } = render(<Skeleton height="1rem" borderRadius="0.25rem" />);
        expect(container.firstChild).toHaveStyle({ borderRadius: "0.25rem" });
    });

    it("appends an extra className when provided", () => {
        const { container } = render(<Skeleton height="1rem" className="custom-class" />);
        expect(container.firstChild).toHaveClass("skeleton", "custom-class");
    });
});
