import { vi } from "vitest";

vi.mock("../../services/email", () => ({
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
    sendEmailVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));
