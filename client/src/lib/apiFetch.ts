import { API_URL } from "@config/api";

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
        throw new Error(error.message ?? fallbackMessage);
    }
    try {
        return await res.json();
    } catch {
        return undefined as T;
    }
}
