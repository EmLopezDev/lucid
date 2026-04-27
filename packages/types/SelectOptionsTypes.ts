import { type StatusType, type PlatformType } from "./UserLibrary";

export interface SelectOptionType<V = string, L extends string = string> {
    value: V;
    label: L;
}

export type SortValueType = "recently" | "alphabetical" | "rated" | "price";
export type SortLabelType = "recently added" | "Title A-Z" | "Highest Rated" | "Highest Price";

export type StatusOptionType = SelectOptionType<StatusType, StatusType>;
export type SortOptionType = SelectOptionType<SortValueType, SortLabelType>;
export type PlatformOptionType = SelectOptionType<PlatformType, PlatformType>;
