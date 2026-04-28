import { objectCopy } from "./generic";
import {
    type StatusFilterOptionType,
    type StatusOptionType,
    type SortOptionType,
    type PlatformOptionType,
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

export const statusOptions: StatusOptionType[] = [
    { value: "playing", label: "playing" },
    { value: "completed", label: "completed" },
    { value: "paused", label: "paused" },
    { value: "dropped", label: "dropped" },
    { value: "wishlist", label: "wishlist" },
];

export const statusFilterOptions: StatusFilterOptionType[] = [
    { value: "all", label: "all" },
    { value: "playing", label: "playing" },
    { value: "completed", label: "completed" },
    { value: "paused", label: "paused" },
    { value: "dropped", label: "dropped" },
    { value: "wishlist", label: "wishlist" },
];

export const sortOptions: SortOptionType[] = [
    { value: "recently", label: "recently added" },
    { value: "alphabetical", label: "Title A-Z" },
    { value: "rated", label: "Highest Rated" },
    { value: "price", label: "Highest Price" },
];

export const platformOptions: PlatformOptionType[] = [
    { value: "playstation", label: "playstation" },
    { value: "xbox", label: "xbox" },
    { value: "nintendo", label: "nintendo" },
    { value: "PC", label: "PC" },
];
