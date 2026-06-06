import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
    describe("rendering", () => {
        it("renders the capitalized label as text", () => {
            render(<Badge label="playing" />);
            expect(screen.getByText("Playing")).toBeInTheDocument();
        });

        it("renders an aria-label with the label", () => {
            render(<Badge label="playing" />);
            expect(screen.getByLabelText("Playing")).toBeInTheDocument();
        });

        it("applies the small size class by default", () => {
            render(<Badge label="playing" />);
            expect(screen.getByText("Playing")).toHaveClass("badge--small");
        });

        it("applies the given size class", () => {
            render(<Badge label="playing" size="large" />);
            expect(screen.getByText("Playing")).toHaveClass("badge--large");
        });
    });

    describe("label variants", () => {
        const statuses = ["playing", "completed", "paused", "dropped", "wishlist"] as const;

        statuses.forEach((status) => {
            it(`applies the correct class for ${status}`, () => {
                render(<Badge label={status} />);
                const label = status.charAt(0).toUpperCase() + status.slice(1);
                expect(screen.getByText(label)).toHaveClass(`badge__${status}`);
            });
        });
    });
});
