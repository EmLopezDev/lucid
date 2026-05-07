import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
    describe("rendering", () => {
        it("renders the capitalized status as text", () => {
            render(<Badge status="playing" />);
            expect(screen.getByText("Playing")).toBeInTheDocument();
        });

        it("renders an aria-label with the status", () => {
            render(<Badge status="playing" />);
            expect(screen.getByLabelText("Status: Playing")).toBeInTheDocument();
        });

        it("applies the small size class by default", () => {
            render(<Badge status="playing" />);
            expect(screen.getByText("Playing")).toHaveClass("badge--small");
        });

        it("applies the given size class", () => {
            render(<Badge status="playing" size="large" />);
            expect(screen.getByText("Playing")).toHaveClass("badge--large");
        });
    });

    describe("status variants", () => {
        const statuses = ["playing", "completed", "paused", "dropped", "wishlist"] as const;

        statuses.forEach((status) => {
            it(`applies the correct class for ${status}`, () => {
                render(<Badge status={status} />);
                const label = status.charAt(0).toUpperCase() + status.slice(1);
                expect(screen.getByText(label)).toHaveClass(`badge__${status}`);
            });
        });
    });
});
