import type { UserLibraryDataType, StatusType, SortValueType } from "@lucid/types";

export const filterByTitle = (data: UserLibraryDataType[], title: string) => {
    if (!title) return data;
    return data.filter((d) => {
        return d.title.toLowerCase().startsWith(title.toLowerCase());
    });
};

export const filterByStatus = (data: UserLibraryDataType[], status: StatusType | string) => {
    if (status === "all") {
        return [...data];
    } else {
        return data.filter((d) => d.status === status);
    }
};

export const filterBySort = (data: UserLibraryDataType[], sort: SortValueType | string) => {
    if (sort === "recently") {
        return [...data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    } else if (sort === "alphabetical") {
        return [...data].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "rated") {
        return [...data].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    } else {
        return [...data].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    }
};
