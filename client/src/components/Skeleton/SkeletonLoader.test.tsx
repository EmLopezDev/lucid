import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkeletonLoader from "./SkeletonLoader";

describe("SkeletonLoader", () => {
    it("renders a role=status element", () => {
        render(<SkeletonLoader>Content</SkeletonLoader>);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has aria-busy=true", () => {
        render(<SkeletonLoader>Content</SkeletonLoader>);
        expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    });

    it("uses the default aria-label of Loading content", () => {
        render(<SkeletonLoader>Content</SkeletonLoader>);
        expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading content");
    });

    it("applies a custom label", () => {
        render(<SkeletonLoader label="Loading games">Content</SkeletonLoader>);
        expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading games");
    });

    it("renders children", () => {
        render(<SkeletonLoader><p>Child content</p></SkeletonLoader>);
        expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders the label in an sr-only span", () => {
        render(<SkeletonLoader label="Loading games">Content</SkeletonLoader>);
        const srOnly = screen.getByRole("status").querySelector(".sr-only");
        expect(srOnly).toHaveTextContent("Loading games");
    });
});
