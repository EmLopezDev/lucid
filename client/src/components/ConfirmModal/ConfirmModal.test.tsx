import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "./ConfirmModal";

const renderConfirmModal = ({
    isOpen = true,
    onConfirm = vi.fn(),
    onCancel = vi.fn(),
    confirmLabel,
    cancelLabel,
    isLoading,
}: {
    isOpen?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
} = {}) =>
    render(
        <ConfirmModal
            isOpen={isOpen}
            title="Confirm Action"
            message="Are you sure?"
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            isLoading={isLoading}
        />,
    );

describe("ConfirmModal", () => {
    describe("rendering", () => {
        it("does not render when isOpen is false", () => {
            renderConfirmModal({ isOpen: false });
            expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
        });

        it("renders the title and message when open", () => {
            renderConfirmModal();
            expect(screen.getByText("Confirm Action")).toBeInTheDocument();
            expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        });

        it("renders default button labels", () => {
            renderConfirmModal();
            expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        });

        it("renders custom button labels", () => {
            renderConfirmModal({ confirmLabel: "Delete", cancelLabel: "Go back" });
            expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
        });
    });

    describe("actions", () => {
        it("calls onConfirm when the confirm button is clicked", async () => {
            const onConfirm = vi.fn();
            renderConfirmModal({ onConfirm });
            await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
            expect(onConfirm).toHaveBeenCalledOnce();
        });

        it("calls onCancel when the cancel button is clicked", async () => {
            const onCancel = vi.fn();
            renderConfirmModal({ onCancel });
            await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
            expect(onCancel).toHaveBeenCalledOnce();
        });

        it("starts closing when the close button is clicked", async () => {
            renderConfirmModal();
            await userEvent.click(screen.getByRole("button", { name: "close modal" }));
            expect(document.querySelector(".modal--closing")).toBeInTheDocument();
        });

        it("starts closing when the overlay is clicked", async () => {
            renderConfirmModal();
            await userEvent.click(document.querySelector(".modal__overlay")!);
            expect(document.querySelector(".modal--closing")).toBeInTheDocument();
        });
    });

    describe("loading state", () => {
        it("disables the confirm button when isLoading is true", () => {
            renderConfirmModal({ isLoading: true });
            expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
        });

        it("disables the cancel button when isLoading is true", () => {
            renderConfirmModal({ isLoading: true });
            expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
        });

        it("does not disable either button by default", () => {
            renderConfirmModal();
            expect(screen.getByRole("button", { name: "Confirm" })).not.toBeDisabled();
            expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
        });

        it("does not start closing when the close button is clicked while isLoading is true", async () => {
            renderConfirmModal({ isLoading: true });
            await userEvent.click(screen.getByRole("button", { name: "close modal" }));
            expect(document.querySelector(".modal--closing")).not.toBeInTheDocument();
        });

        it("does not start closing when the overlay is clicked while isLoading is true", async () => {
            renderConfirmModal({ isLoading: true });
            await userEvent.click(document.querySelector(".modal__overlay")!);
            expect(document.querySelector(".modal--closing")).not.toBeInTheDocument();
        });
    });
});
