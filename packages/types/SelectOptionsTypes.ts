export interface SelectOptionType<V = string, L extends string = string> {
    value: V;
    label: L;
}

export type StatusType = "all" | "playing" | "completed" | "paused" | "dropped" | "wishlist";
export type SortValueType = "recently" | "alphabetical" | "rated" | "price";
export type SortLabelType = "recently added" | "Title A-Z" | "Highest Rated" | "Highest Price";

export type StatusOptionType = SelectOptionType<StatusType, StatusType>;
export type SortOptionType = SelectOptionType<SortValueType, SortLabelType>;
