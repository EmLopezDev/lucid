import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatePicker from "./DatePicker";

const FIXED_VALUE = "2024-05-15";
const FIXED_DISPLAY = "May 15, 2024";

describe("DatePicker", () => {
    describe("rendering", () => {
        it("shows 'Select date' when no value is given", () => {
            render(<DatePicker onChange={vi.fn()} />);
            expect(screen.getByText("Select date")).toBeInTheDocument();
        });

        it("shows the formatted date when a value is given", () => {
            render(<DatePicker value={FIXED_VALUE} onChange={vi.fn()} />);
            expect(screen.getByText(FIXED_DISPLAY)).toBeInTheDocument();
        });

        it("renders a label when provided", () => {
            render(<DatePicker label="Release date" onChange={vi.fn()} />);
            expect(screen.getByText("Release date")).toBeInTheDocument();
        });

        it("is closed by default", () => {
            render(<DatePicker onChange={vi.fn()} />);
            expect(screen.getByRole("button", { name: "Select date" })).toHaveAttribute(
                "aria-expanded",
                "false",
            );
        });
    });

    describe("open / close", () => {
        it("opens the calendar dialog on trigger click", async () => {
            render(<DatePicker onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: "Select date" }));
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("sets aria-expanded to true when open", async () => {
            render(<DatePicker onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: "Select date" }));
            expect(screen.getByRole("button", { name: "Select date" })).toHaveAttribute(
                "aria-expanded",
                "true",
            );
        });

        it("closes the calendar on second trigger click", async () => {
            render(<DatePicker onChange={vi.fn()} />);
            const trigger = screen.getByRole("button", { name: "Select date" });
            await userEvent.click(trigger);
            await userEvent.click(trigger);
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("closes on outside click", async () => {
            render(
                <div>
                    <DatePicker onChange={vi.fn()} />
                    <button>Outside</button>
                </div>,
            );
            await userEvent.click(screen.getByRole("button", { name: "Select date" }));
            await userEvent.click(screen.getByRole("button", { name: "Outside" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    describe("footer actions", () => {
        it("Today button calls onChange with today's ISO date", async () => {
            const handleChange = vi.fn();
            const today = new Date();
            const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

            render(<DatePicker onChange={handleChange} />);
            await userEvent.click(screen.getByRole("button", { name: "Select date" }));
            await userEvent.click(screen.getByRole("button", { name: "Today" }));
            expect(handleChange).toHaveBeenCalledWith(expected);
        });

        it("Today button closes the calendar", async () => {
            render(<DatePicker onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: "Select date" }));
            await userEvent.click(screen.getByRole("button", { name: "Today" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("Clear button calls onChange with an empty string", async () => {
            const handleChange = vi.fn();
            render(<DatePicker value={FIXED_VALUE} onChange={handleChange} />);
            await userEvent.click(screen.getByRole("button", { name: FIXED_DISPLAY }));
            await userEvent.click(screen.getByRole("button", { name: "Clear" }));
            expect(handleChange).toHaveBeenCalledWith("");
        });

        it("Clear button closes the calendar", async () => {
            render(<DatePicker value={FIXED_VALUE} onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: FIXED_DISPLAY }));
            await userEvent.click(screen.getByRole("button", { name: "Clear" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("shows 'Select date' after clearing", async () => {
            render(<DatePicker value={FIXED_VALUE} onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: FIXED_DISPLAY }));
            await userEvent.click(screen.getByRole("button", { name: "Clear" }));
            expect(screen.getByText("Select date")).toBeInTheDocument();
        });
    });

    describe("day selection", () => {
        it("calls onChange with the ISO date string when a day is clicked", async () => {
            const handleChange = vi.fn();
            render(<DatePicker value={FIXED_VALUE} onChange={handleChange} />);
            await userEvent.click(screen.getByRole("button", { name: FIXED_DISPLAY }));
            await userEvent.click(screen.getByRole("button", { name: "Monday, May 20th, 2024" }));
            expect(handleChange).toHaveBeenCalledWith("2024-05-20");
        });

        it("closes the calendar after a day is selected", async () => {
            render(<DatePicker value={FIXED_VALUE} onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("button", { name: FIXED_DISPLAY }));
            await userEvent.click(screen.getByRole("button", { name: "Monday, May 20th, 2024" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });
});
