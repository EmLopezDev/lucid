import { API_URL } from "@config/api";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}
const isAbsoluteUrl = (value: string) => /^https?:\/\//.test(value);

export async function apiFetch<T = void>(
    url: string,
    options: RequestInit = {},
    fallbackMessage = "Something went wrong",
): Promise<T> {
    const resolvedUrl = isAbsoluteUrl(url) ? url : `${API_URL}${url}`;
    let res: Response;
    try {
        res = await fetch(resolvedUrl, { credentials: "include", ...options });
    } catch {
        throw new Error(fallbackMessage);
    }
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new ApiError(error.message ?? fallbackMessage, res.status);
    }
    try {
        return await res.json();
    } catch {
        return undefined as T;
    }
}
