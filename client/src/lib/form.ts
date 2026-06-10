import { objectCopy } from "./generic";
import {
    type SelectOptionType,
    type StatusFilterOptionType,
    type StatusOptionType,
    type SortOptionType,
    type PlatformOptionType,
    type GenreOptionType,
} from "../types/SelectOptionsTypes";

export type FormRules<T> = Record<keyof T, [(v: string) => boolean, string][]>;

export const isFormDataValid = <T extends Record<string, string>>(
    data: T,
    rules: FormRules<T>,
    emptyForm: T,
) => {
    const errors = objectCopy(emptyForm);

    for (const field in rules) {
        const failed = rules[field].find(([check]) => !check(data[field]));
        if (failed) errors[field] = failed[1] as T[typeof field];
    }

    return errors;
};

export const hasErrors = <T extends Record<string, string>>(errors: T) =>
    Object.values(errors).some(Boolean);

function toOptions<V extends string>(values: V[]): SelectOptionType<V, V>[];
function toOptions<V extends string, L extends string>(pairs: [V, L][]): SelectOptionType<V, L>[];
function toOptions<V extends string, L extends string>(
    entries: V[] | [V, L][],
): SelectOptionType<V, V | L>[] {
    return (entries as Array<V | [V, L]>).map((entry) =>
        Array.isArray(entry)
            ? { value: entry[0], label: entry[1] }
            : { value: entry, label: entry },
    );
}

export const statusOptions: StatusOptionType[] = [
    { value: null, label: "Not set" },
    ...toOptions(["playing", "completed", "paused", "dropped", "wishlist"]),
];

export const statusFilterOptions: StatusFilterOptionType[] = toOptions([
    "all",
    "playing",
    "completed",
    "paused",
    "dropped",
    "wishlist",
]);

export const sortOptions: SortOptionType[] = toOptions([
    ["recently", "recently added"],
    ["alphabetical", "Title A-Z"],
    ["rated", "Highest Rated"],
    ["price", "Highest Price"],
]);

export const platformOptions: PlatformOptionType[] = [
    { value: null, label: "Not set" },
    ...toOptions([
        // PlayStation
        "PlayStation 5",
        "PlayStation 4",
        "PlayStation 3",
        "PlayStation 2",
        "PlayStation",
        "PS Vita",
        "PSP",
        // Xbox
        "Xbox Series X/S",
        "Xbox One",
        "Xbox 360",
        "Xbox",
        // Nintendo
        "Nintendo Switch",
        "Wii U",
        "Wii",
        "GameCube",
        "Nintendo 64",
        "SNES",
        "NES",
        "Game Boy Advance",
        "Game Boy Color",
        "Game Boy",
        "Nintendo 3DS",
        "Nintendo DS",
        "Nintendo",
        // PC & OS
        "PC",
        "macOS",
        "Linux",
        // Mobile
        "iOS",
        "Android",
        // Other
        "Other",
    ]),
];

export const genreOptions: GenreOptionType[] = [
    { value: null, label: "Not set" },
    ...toOptions([
        "action",
        "adventure",
        "role-playing",
        "strategy",
        "shooter",
        "simulation",
        "puzzle",
        "platformer",
        "racing",
        "sports",
        "fighting",
        "indie",
        "casual",
        "arcade",
        "multiplayer",
        "family",
        "other",
    ]),
];
