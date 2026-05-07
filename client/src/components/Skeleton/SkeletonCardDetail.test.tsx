import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SkeletonCardDetail from "./SkeletonCardDetail";

describe("SkeletonCardDetail", () => {
    it("renders the skeleton-card-detail element", () => {
        const { container } = render(<SkeletonCardDetail />);
        expect(container.querySelector(".skeleton-card-detail")).toBeInTheDocument();
    });

    it("is aria-hidden", () => {
        const { container } = render(<SkeletonCardDetail />);
        expect(container.querySelector(".skeleton-card-detail")).toHaveAttribute(
            "aria-hidden",
            "true",
        );
    });

    it("renders 4 stat grid items", () => {
        const { container } = render(<SkeletonCardDetail />);
        expect(container.querySelectorAll(".skeleton-card-detail__stat")).toHaveLength(4);
    });
});
