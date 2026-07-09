import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

const renderModal = (isOpen: boolean, onClose = vi.fn(), preventClose = false) =>
    render(
        <Modal
            isOpen={isOpen}
            title="Test Modal"
            onClose={onClose}
            preventClose={preventClose}
        >
            <p>Modal body</p>
        </Modal>,
    );

describe("Modal", () => {
    describe("rendering", () => {
        it("does not render when isOpen is false", () => {
            renderModal(false);
            expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
        });

        it("renders the title when open", () => {
            renderModal(true);
            expect(screen.getByText("Test Modal")).toBeInTheDocument();
        });

        it("renders children when open", () => {
            renderModal(true);
            expect(screen.getByText("Modal body")).toBeInTheDocument();
        });

        it("renders a close button", () => {
            renderModal(true);
            expect(screen.getByRole("button", { name: "close modal" })).toBeInTheDocument();
        });
    });

    describe("close triggers", () => {
        it("starts closing when the close button is clicked", async () => {
            renderModal(true);
            await userEvent.click(screen.getByRole("button", { name: "close modal" }));
            expect(document.querySelector(".modal--closing")).toBeInTheDocument();
        });

        it("starts closing when the overlay is clicked", async () => {
            renderModal(true);
            await userEvent.click(document.querySelector(".modal__overlay")!);
            expect(document.querySelector(".modal--closing")).toBeInTheDocument();
        });

        it("does not close when clicking inside the modal content", async () => {
            renderModal(true);
            await userEvent.click(screen.getByText("Modal body"));
            expect(document.querySelector(".modal--closing")).not.toBeInTheDocument();
        });

        it("starts closing on Escape key", async () => {
            renderModal(true);
            await userEvent.keyboard("{Escape}");
            expect(document.querySelector(".modal--closing")).toBeInTheDocument();
        });
    });

    describe("preventClose", () => {
        it("disables the close button when preventClose is true", () => {
            renderModal(true, vi.fn(), true);
            expect(screen.getByRole("button", { name: "close modal" })).toBeDisabled();
        });

        it("does not start closing when the close button is clicked", async () => {
            renderModal(true, vi.fn(), true);
            await userEvent.click(screen.getByRole("button", { name: "close modal" }));
            expect(document.querySelector(".modal--closing")).not.toBeInTheDocument();
        });

        it("does not start closing when the overlay is clicked", async () => {
            renderModal(true, vi.fn(), true);
            await userEvent.click(document.querySelector(".modal__overlay")!);
            expect(document.querySelector(".modal--closing")).not.toBeInTheDocument();
        });

        it("does not start closing on Escape key", async () => {
            renderModal(true, vi.fn(), true);
            await userEvent.keyboard("{Escape}");
            expect(document.querySelector(".modal--closing")).not.toBeInTheDocument();
        });
    });

    describe("scroll lock", () => {
        it("sets body overflow to hidden when open", () => {
            renderModal(true);
            expect(document.body.style.overflow).toBe("hidden");
        });

        it("restores body overflow when closing starts", async () => {
            renderModal(true);
            await userEvent.click(screen.getByRole("button", { name: "close modal" }));
            expect(document.body.style.overflow).toBe("");
        });
    });

    describe("isOpen prop change", () => {
        it("renders the modal when isOpen changes to true", () => {
            const { rerender } = renderModal(false);
            rerender(
                <Modal isOpen title="Test Modal" onClose={vi.fn()}>
                    <p>Modal body</p>
                </Modal>,
            );
            expect(screen.getByText("Test Modal")).toBeInTheDocument();
        });

        it("starts closing when isOpen changes to false", () => {
            const { rerender } = renderModal(true);
            rerender(
                <Modal isOpen={false} title="Test Modal" onClose={vi.fn()}>
                    <p>Modal body</p>
                </Modal>,
            );
            expect(document.querySelector(".modal--closing")).toBeInTheDocument();
        });
    });
});
