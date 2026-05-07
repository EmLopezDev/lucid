import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HoursBar from "./HoursBar";

describe("HoursBar", () => {
    describe("rendering", () => {
        it("renders a progressbar", () => {
            render(<HoursBar hours={10} />);
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });

        it("applies the medium size class by default", () => {
            const { container } = render(<HoursBar hours={10} />);
            expect(container.firstChild).toHaveClass("hours-bar--medium");
        });

        it("applies the given size class", () => {
            const { container } = render(<HoursBar hours={10} size="small" />);
            expect(container.firstChild).toHaveClass("hours-bar--small");
        });

        it("applies the completed class when status is completed", () => {
            const { container } = render(<HoursBar hours={10} status="completed" />);
            expect(container.firstChild).toHaveClass("hours-bar--completed");
        });

        it("does not apply the completed class for other statuses", () => {
            const { container } = render(<HoursBar hours={10} status="playing" />);
            expect(container.firstChild).not.toHaveClass("hours-bar--completed");
        });
    });

    describe("hours label", () => {
        it("shows singular 'hr' for 1 hour", () => {
            render(<HoursBar hours={1} />);
            expect(screen.getByText("1 hr played")).toBeInTheDocument();
        });

        it("shows plural 'hrs' for 0 hours", () => {
            render(<HoursBar hours={0} />);
            expect(screen.getByText("0 hrs played")).toBeInTheDocument();
        });

        it("shows plural 'hrs' for multiple hours", () => {
            render(<HoursBar hours={25} />);
            expect(screen.getByText("25 hrs played")).toBeInTheDocument();
        });

        it("shows a + suffix when hours reach the soft cap of 100", () => {
            render(<HoursBar hours={100} />);
            expect(screen.getByText("100+ hrs played")).toBeInTheDocument();
        });

        it("shows a + suffix above the soft cap", () => {
            render(<HoursBar hours={200} />);
            expect(screen.getByText("200+ hrs played")).toBeInTheDocument();
        });

        it("treats null hours as 0", () => {
            render(<HoursBar hours={null} />);
            expect(screen.getByText("0 hrs played")).toBeInTheDocument();
        });
    });

    describe("progress bar fill", () => {
        it("fills to 100% when status is completed", () => {
            render(<HoursBar hours={50} status="completed" />);
            expect(screen.getByRole("progressbar")).toHaveStyle({ width: "100%" });
        });

        it("caps fill at 90% when not completed", () => {
            render(<HoursBar hours={100} status="playing" />);
            expect(screen.getByRole("progressbar")).toHaveStyle({ width: "90%" });
        });

        it("rounds up to the next multiple of 10", () => {
            render(<HoursBar hours={11} status="playing" />);
            expect(screen.getByRole("progressbar")).toHaveStyle({ width: "20%" });
        });

        it("uses exact multiples of 10 without rounding up", () => {
            render(<HoursBar hours={20} status="playing" />);
            expect(screen.getByRole("progressbar")).toHaveStyle({ width: "20%" });
        });

        it("shows 0% fill for 0 hours", () => {
            render(<HoursBar hours={0} />);
            expect(screen.getByRole("progressbar")).toHaveStyle({ width: "0%" });
        });

        it("sets aria-valuenow to the fill percentage", () => {
            render(<HoursBar hours={20} status="playing" />);
            expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "20");
        });
    });

    describe("status label", () => {
        it("shows 'In Progress' when status is playing", () => {
            render(<HoursBar hours={10} status="playing" />);
            expect(screen.getByText("In Progress")).toBeInTheDocument();
        });

        it("shows '100%' when status is completed", () => {
            render(<HoursBar hours={10} status="completed" />);
            expect(screen.getByText("100%")).toBeInTheDocument();
        });

        it("shows no status label when status is paused", () => {
            render(<HoursBar hours={10} status="paused" />);
            expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
            expect(screen.queryByText("100%")).not.toBeInTheDocument();
        });

        it("shows no status label when status is dropped", () => {
            render(<HoursBar hours={10} status="dropped" />);
            expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
        });

        it("shows no status label when status is wishlist", () => {
            render(<HoursBar hours={10} status="wishlist" />);
            expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
        });

        it("shows no status label when no status is given", () => {
            render(<HoursBar hours={10} />);
            expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
            expect(screen.queryByText("100%")).not.toBeInTheDocument();
        });
    });
});
