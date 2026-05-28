import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import AppNav from "./AppNav";

const mockSignOut = vi.fn();

vi.mock("../../contexts/UserContext/useUserContext", () => ({
    useUserContext: () => ({ signOut: mockSignOut }),
}));

const renderNav = (isUserAuthenticated: boolean) =>
    render(
        <MemoryRouter>
            <AppNav isUserAuthenticated={isUserAuthenticated} />
        </MemoryRouter>,
    );

describe("AppNav", () => {
    beforeEach(() => {
        mockSignOut.mockReset();
    });

    describe("brand", () => {
        it("renders the brand link", () => {
            renderNav(false);
            expect(screen.getByRole("link", { name: /LUCID/i })).toBeInTheDocument();
        });
    });

    describe("unauthenticated", () => {
        it("shows Sign In link", () => {
            renderNav(false);
            expect(screen.getAllByRole("link", { name: "Sign In" }).length).toBeGreaterThan(0);
        });

        it("shows Register link", () => {
            renderNav(false);
            expect(screen.getAllByRole("link", { name: "Register" }).length).toBeGreaterThan(0);
        });

        it("does not show Sign Out button", () => {
            renderNav(false);
            expect(screen.queryByRole("button", { name: "Sign Out" })).not.toBeInTheDocument();
        });
    });

    describe("authenticated", () => {
        it("shows Library link", () => {
            renderNav(true);
            expect(screen.getAllByRole("link", { name: "Library" }).length).toBeGreaterThan(0);
        });

        it("shows Sign Out button", () => {
            renderNav(true);
            expect(screen.getAllByRole("button", { name: "Sign Out" }).length).toBeGreaterThan(0);
        });

        it("calls signOut when Sign Out is clicked", async () => {
            renderNav(true);
            await userEvent.click(screen.getAllByRole("button", { name: "Sign Out" })[0]!);
            expect(mockSignOut).toHaveBeenCalledOnce();
        });

        it("shows Profile link", () => {
            renderNav(true);
            expect(screen.getAllByRole("link", { name: "Profile" }).length).toBeGreaterThan(0);
        });

        it("does not show Settings link", () => {
            renderNav(true);
            expect(screen.queryByRole("link", { name: "Settings" })).not.toBeInTheDocument();
        });
    });

    describe("hamburger menu", () => {
        it("has aria-label 'Open menu' when closed", () => {
            renderNav(false);
            expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
        });

        it("has aria-expanded false when closed", () => {
            renderNav(false);
            expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
                "aria-expanded",
                "false",
            );
        });

        it("opens the menu on click and updates aria attributes", async () => {
            renderNav(false);
            await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
            expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
                "aria-expanded",
                "true",
            );
        });

        it("applies the open class to nav links when menu is open", async () => {
            const { container } = renderNav(false);
            await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
            expect(container.querySelector(".app-layout__nav-links--open")).toBeInTheDocument();
        });

        it("starts closing when hamburger is clicked while open", async () => {
            const { container } = renderNav(false);
            await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
            await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
            expect(container.querySelector(".app-layout__nav-links--closing")).toBeInTheDocument();
        });

        it("starts closing on Escape key when menu is open", async () => {
            const { container } = renderNav(false);
            await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
            await userEvent.keyboard("{Escape}");
            expect(container.querySelector(".app-layout__nav-links--closing")).toBeInTheDocument();
        });
    });
});
