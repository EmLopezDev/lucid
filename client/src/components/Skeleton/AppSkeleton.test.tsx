import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppSkeleton from "./AppSkeleton";

describe("AppSkeleton", () => {
    it("renders a role=status element", () => {
        render(<AppSkeleton />);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has aria-label of Loading application", () => {
        render(<AppSkeleton />);
        expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading application");
    });

    it("renders the app-layout structure", () => {
        const { container } = render(<AppSkeleton />);
        expect(container.querySelector(".app-layout")).toBeInTheDocument();
    });
});
