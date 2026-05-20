import { describe, it, expect } from "vitest";
import { capitalizeString, nameCheck, emailCheck } from "./string";

describe("capitalizeString", () => {
    it("capitalizes the first letter", () => {
        expect(capitalizeString("hello")).toBe("Hello");
    });

    it("leaves the rest of the string unchanged", () => {
        expect(capitalizeString("action game")).toBe("Action game");
    });

    it("handles a single character", () => {
        expect(capitalizeString("a")).toBe("A");
    });

    it("handles an already capitalized string", () => {
        expect(capitalizeString("Playing")).toBe("Playing");
    });

    it("handles an empty string", () => {
        expect(capitalizeString("")).toBe("");
    });
});

describe("nameCheck", () => {
    it("accepts letters only", () => {
        expect(nameCheck("John")).toBe(true);
    });

    it("accepts letters with spaces", () => {
        expect(nameCheck("John Doe")).toBe(true);
    });

    it("rejects numbers", () => {
        expect(nameCheck("John1")).toBe(false);
    });

    it("rejects special characters", () => {
        expect(nameCheck("John!")).toBe(false);
    });

    it("rejects an empty string", () => {
        expect(nameCheck("")).toBe(false);
    });
});

describe("emailCheck", () => {
    it("accepts a valid email", () => {
        expect(emailCheck("user@example.com")).toBe(true);
    });

    it("accepts emails with subdomains", () => {
        expect(emailCheck("user@mail.example.com")).toBe(true);
    });

    it("accepts emails with dots and hyphens in the local part", () => {
        expect(emailCheck("first.last@example.com")).toBe(true);
    });

    it("rejects an email without @", () => {
        expect(emailCheck("userexample.com")).toBe(false);
    });

    it("rejects an email without a domain", () => {
        expect(emailCheck("user@")).toBe(false);
    });

    it("rejects an email without a TLD", () => {
        expect(emailCheck("user@example")).toBe(false);
    });

    it("rejects an empty string", () => {
        expect(emailCheck("")).toBe(false);
    });
});
