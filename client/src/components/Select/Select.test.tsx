import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

const options = [
    { value: "playing", label: "playing" },
    { value: "completed", label: "completed" },
    { value: "paused", label: "paused" },
];

function getListboxWrapper(container: HTMLElement) {
    return container.querySelector(".select__listbox-wrapper")!;
}

describe("Select", () => {
    describe("rendering", () => {
        it("renders the combobox trigger", () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        it("shows 'Select an option' when no value matches", () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            expect(screen.getByText("Select an option")).toBeInTheDocument();
        });

        it("shows the selected option label", () => {
            render(<Select id="test" options={options} value="playing" onChange={vi.fn()} />);
            expect(screen.getByText("Playing")).toBeInTheDocument();
        });

        it("renders a label when provided", () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} label="Status" />);
            expect(screen.getByText("Status")).toBeInTheDocument();
        });

        it("is closed by default", () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
        });

        it("applies the medium size class by default", () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            expect(screen.getByRole("combobox")).toHaveClass("select__trigger--medium");
        });

        it("applies the given size class", () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} selectSize="large" />);
            expect(screen.getByRole("combobox")).toHaveClass("select__trigger--large");
        });
    });

    describe("open / close", () => {
        it("opens the listbox on trigger click", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });

        it("sets aria-expanded to true when open", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
        });

        it("sets aria-expanded to false when closing", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.click(screen.getByRole("combobox"));
            expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
        });

        it("applies the closing class when trigger is clicked while open", async () => {
            const { container } = render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.click(screen.getByRole("combobox"));
            expect(getListboxWrapper(container)).toHaveClass("select__listbox-wrapper--closing");
        });

        it("closes on Escape key", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{Escape}");
            expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
        });

        it("closes on outside click", async () => {
            render(
                <div>
                    <Select id="test" options={options} value="" onChange={vi.fn()} />
                    <button>Outside</button>
                </div>,
            );
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.click(screen.getByText("Outside"));
            expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
        });
    });

    describe("options", () => {
        it("renders all options when open", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            expect(screen.getAllByRole("option")).toHaveLength(options.length);
        });

        it("marks the selected option with aria-selected", async () => {
            render(<Select id="test" options={options} value="playing" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            expect(screen.getByRole("option", { name: "Playing" })).toHaveAttribute("aria-selected", "true");
        });

        it("marks unselected options with aria-selected false", async () => {
            render(<Select id="test" options={options} value="playing" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            expect(screen.getByRole("option", { name: "Completed" })).toHaveAttribute("aria-selected", "false");
        });

        it("calls onChange with the clicked option", async () => {
            const handleChange = vi.fn();
            render(<Select id="test" options={options} value="" onChange={handleChange} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.click(screen.getByRole("option", { name: "Playing" }));
            expect(handleChange).toHaveBeenCalledWith({ value: "playing", label: "playing" });
        });
    });

    describe("keyboard navigation", () => {
        it("opens on ArrowDown", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            screen.getByRole("combobox").focus();
            await userEvent.keyboard("{ArrowDown}");
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });

        it("moves focus down with ArrowDown", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{ArrowDown}");
            expect(screen.getAllByRole("option")[1]).toHaveClass("select__option--focused");
        });

        it("moves focus up with ArrowUp", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}");
            expect(screen.getAllByRole("option")[1]).toHaveClass("select__option--focused");
        });

        it("moves focus to the first option with Home", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{ArrowDown}{Home}");
            expect(screen.getAllByRole("option")[0]).toHaveClass("select__option--focused");
        });

        it("moves focus to the last option with End", async () => {
            render(<Select id="test" options={options} value="" onChange={vi.fn()} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{End}");
            expect(screen.getAllByRole("option")[options.length - 1]).toHaveClass("select__option--focused");
        });

        it("selects the focused option on Enter", async () => {
            const handleChange = vi.fn();
            render(<Select id="test" options={options} value="" onChange={handleChange} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{ArrowDown}{Enter}");
            expect(handleChange).toHaveBeenCalledWith({ value: "completed", label: "completed" });
        });

        it("selects the focused option on Space", async () => {
            const handleChange = vi.fn();
            render(<Select id="test" options={options} value="" onChange={handleChange} />);
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.keyboard("{ArrowDown}{ }");
            expect(handleChange).toHaveBeenCalledWith({ value: "completed", label: "completed" });
        });
    });
});
