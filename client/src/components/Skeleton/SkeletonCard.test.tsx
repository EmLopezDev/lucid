import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SkeletonCard from "./SkeletonCard";

describe("SkeletonCard", () => {
    it("renders the skeleton-card element", () => {
        const { container } = render(<SkeletonCard />);
        expect(container.querySelector(".skeleton-card")).toBeInTheDocument();
    });

    it("is aria-hidden", () => {
        const { container } = render(<SkeletonCard />);
        expect(container.querySelector(".skeleton-card")).toHaveAttribute("aria-hidden", "true");
    });

    it("renders skeleton children", () => {
        const { container } = render(<SkeletonCard />);
        expect(container.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
    });
});
