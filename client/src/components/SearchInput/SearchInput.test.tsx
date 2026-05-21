import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

type TestResult = { id: number; name: string };

const mockResults: TestResult[] = [
    { id: 1, name: "Zelda: Breath of the Wild" },
    { id: 2, name: "Zelda: Tears of the Kingdom" },
];

const defaultProps = {
    label: "Title",
    placeholder: "Search for a game...",
    inputSize: "medium" as const,
    query: "",
    results: [] as TestResult[],
    isLoading: false,
    onSelect: vi.fn(),
    onReset: vi.fn(),
    onQueryChange: vi.fn(),
    renderResult: (result: TestResult) => result.name,
    getKey: (result: TestResult) => result.id,
    getLabel: (result: TestResult) => result.name,
};

// Renders with a query long enough to show the dropdown once focused
const renderOpen = (overrides: Partial<typeof defaultProps> = {}) => {
    render(<SearchInput {...defaultProps} query="ze" {...overrides} />);
    fireEvent.focus(screen.getByRole("textbox"));
};

describe("SearchInput", () => {
    describe("rendering", () => {
        it("renders the label", () => {
            render(<SearchInput {...defaultProps} />);
            expect(screen.getByText("Title")).toBeInTheDocument();
        });

        it("renders the placeholder", () => {
            render(<SearchInput {...defaultProps} />);
            expect(screen.getByPlaceholderText("Search for a game...")).toBeInTheDocument();
        });

        it("does not show the dropdown initially", () => {
            render(<SearchInput {...defaultProps} />);
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });
    });

    describe("dropdown visibility", () => {
        it("does not show the dropdown when the query is below minQueryLength", () => {
            render(<SearchInput {...defaultProps} query="z" />);
            fireEvent.focus(screen.getByRole("textbox"));
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });

        it("shows the dropdown when focused and query meets minQueryLength", () => {
            renderOpen();
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });

        it("applies the --open class to the container when the dropdown is visible", () => {
            const { container } = render(
                <SearchInput {...defaultProps} query="ze" />,
            );
            fireEvent.focus(screen.getByRole("textbox"));
            expect(container.firstChild).toHaveClass("search-input--open");
        });

        it("shows 'Searching...' when isLoading is true", () => {
            renderOpen({ isLoading: true });
            expect(screen.getByText("Searching...")).toBeInTheDocument();
        });

        it("shows 'No results found' when not loading and results are empty", () => {
            renderOpen({ results: [] });
            expect(screen.getByText("No results found")).toBeInTheDocument();
        });

        it("renders a result item for each result", () => {
            renderOpen({ results: mockResults });
            expect(screen.getAllByRole("option")).toHaveLength(mockResults.length);
        });

        it("renders the correct text for each result", () => {
            renderOpen({ results: mockResults });
            expect(screen.getByText("Zelda: Breath of the Wild")).toBeInTheDocument();
            expect(screen.getByText("Zelda: Tears of the Kingdom")).toBeInTheDocument();
        });

        it("closes the dropdown when clicking outside the component", async () => {
            renderOpen({ results: mockResults });
            expect(screen.getByRole("listbox")).toBeInTheDocument();
            await userEvent.click(document.body);
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });

        it("does not show results while loading", () => {
            renderOpen({ isLoading: true, results: mockResults });
            expect(screen.queryByRole("option")).not.toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onQueryChange with the typed value", () => {
            const onQueryChange = vi.fn();
            render(<SearchInput {...defaultProps} onQueryChange={onQueryChange} />);
            fireEvent.change(screen.getByRole("textbox"), { target: { value: "zelda" } });
            expect(onQueryChange).toHaveBeenCalledWith("zelda");
        });

        it("calls onSelect with the result when a result item is clicked", async () => {
            const onSelect = vi.fn();
            renderOpen({ results: mockResults, onSelect });
            await userEvent.click(screen.getAllByRole("option")[0]!);
            expect(onSelect).toHaveBeenCalledWith(mockResults[0]);
        });

        it("calls onQueryChange with the result label when a result is selected", async () => {
            const onQueryChange = vi.fn();
            renderOpen({ results: mockResults, onQueryChange });
            await userEvent.click(screen.getAllByRole("option")[0]!);
            expect(onQueryChange).toHaveBeenCalledWith("Zelda: Breath of the Wild");
        });

        it("closes the dropdown after a result is selected", async () => {
            renderOpen({ results: mockResults });
            await userEvent.click(screen.getAllByRole("option")[0]!);
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });

        it("calls onReset when typing after a result has been selected", async () => {
            const onReset = vi.fn();
            renderOpen({ results: mockResults, onReset });
            await userEvent.click(screen.getAllByRole("option")[0]!);
            fireEvent.change(screen.getByRole("textbox"), { target: { value: "z" } });
            expect(onReset).toHaveBeenCalledOnce();
        });

        it("does not call onReset when typing without a prior selection", () => {
            const onReset = vi.fn();
            render(<SearchInput {...defaultProps} onReset={onReset} />);
            fireEvent.change(screen.getByRole("textbox"), { target: { value: "zelda" } });
            expect(onReset).not.toHaveBeenCalled();
        });
    });

    describe("minQueryLength", () => {
        it("does not show the dropdown when query is below a custom minQueryLength", () => {
            render(
                <SearchInput
                    {...defaultProps}
                    query="zel"
                    minQueryLength={4}
                />,
            );
            fireEvent.focus(screen.getByRole("textbox"));
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });

        it("shows the dropdown when query meets a custom minQueryLength", () => {
            render(
                <SearchInput
                    {...defaultProps}
                    query="zeld"
                    minQueryLength={4}
                />,
            );
            fireEvent.focus(screen.getByRole("textbox"));
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });
});
