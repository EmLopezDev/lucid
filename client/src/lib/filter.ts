import type { UserLibraryDataType, StatusType, ClubType } from "@lucid/types";
import type { SortValueType } from "../types/SelectOptionsTypes";

export const filterByTitle = (data: UserLibraryDataType[], title: string) => {
    if (!title) return data;
    return data.filter((d) => {
        return d.title.toLowerCase().includes(title.toLowerCase());
    });
};

export const filterByName = (data: ClubType[], name: string) => {
    if (!name) return data;
    return data.filter((d) => {
        return d.name.toLowerCase().includes(name.toLowerCase());
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
