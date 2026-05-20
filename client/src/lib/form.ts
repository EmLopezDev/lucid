import { objectCopy } from "./generic";
import {
    type SelectOptionType,
    type StatusFilterOptionType,
    type StatusOptionType,
    type SortOptionType,
    type PlatformOptionType,
    type GenreOptionType,
} from "../../../packages/types";

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

export const statusOptions: StatusOptionType[] = toOptions([
    "playing",
    "completed",
    "paused",
    "dropped",
    "wishlist",
]);

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

export const platformOptions: PlatformOptionType[] = toOptions([
    "playstation",
    "xbox",
    "nintendo",
    "PC",
]);

export const genreOptions: GenreOptionType[] = toOptions([
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
]);
