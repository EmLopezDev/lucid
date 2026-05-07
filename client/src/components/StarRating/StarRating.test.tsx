import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StarRating from "./StarRating";

describe("StarRating", () => {
    describe("null / zero guard", () => {
        it("renders nothing when rating is null", () => {
            const { container } = render(<StarRating rating={null} />);
            expect(container.firstChild).toBeNull();
        });

        it("renders nothing when rating is 0", () => {
            const { container } = render(<StarRating rating={0} />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("rendering", () => {
        it("renders a role=img element when rating is given", () => {
            render(<StarRating rating={3} />);
            expect(screen.getByRole("img")).toBeInTheDocument();
        });

        it("sets the aria-label to X.X out of 5 stars", () => {
            render(<StarRating rating={3.5} />);
            expect(screen.getByRole("img")).toHaveAttribute(
                "aria-label",
                "3.5 out of 5 stars",
            );
        });

        it("applies the medium size class by default", () => {
            render(<StarRating rating={3} />);
            expect(screen.getByRole("img")).toHaveClass("star-rating--medium");
        });

        it("applies the given size class", () => {
            render(<StarRating rating={3} size="small" />);
            expect(screen.getByRole("img")).toHaveClass("star-rating--small");
        });

        it("renders exactly 5 stars", () => {
            const { container } = render(<StarRating rating={3} />);
            expect(container.querySelectorAll(".star-rating__star")).toHaveLength(5);
        });
    });

    describe("value display", () => {
        it("does not show the numeric value by default", () => {
            render(<StarRating rating={4} />);
            expect(screen.queryByText("4.0")).not.toBeInTheDocument();
        });

        it("shows the numeric value when showValue is true", () => {
            render(<StarRating rating={4} showValue />);
            expect(screen.getByText("4.0")).toBeInTheDocument();
        });
    });

    describe("clamping", () => {
        it("clamps a rating above 5 to 5.0 in the aria-label", () => {
            render(<StarRating rating={10} />);
            expect(screen.getByRole("img")).toHaveAttribute(
                "aria-label",
                "5.0 out of 5 stars",
            );
        });

        it("clamps a rating above 5 to 5.0 in the displayed value", () => {
            render(<StarRating rating={10} showValue />);
            expect(screen.getByText("5.0")).toBeInTheDocument();
        });
    });
});
