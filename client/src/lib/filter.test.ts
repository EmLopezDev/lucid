import { describe, it, expect } from "vitest";
import { filterByTitle, filterByStatus, filterBySort } from "./filter";
import { type UserLibraryDataType } from "@lucid/types";

const base = {
    user_id: "user1",
    favorite: false,
    date_played: null,
    date_purchased: null,
    hours_played: null,
    comment: null,
    price: null,
    updated_at: null,
    deleted_at: null,
    cover_url: null,
    played_with_club: null,
};

const games: UserLibraryDataType[] = [
    {
        ...base,
        _id: "1",
        title: "Zelda",
        status: "playing",
        genre: "action",
        platform: "Nintendo Switch",
        rating: 5,
        price: "60.00",
        created_at: "2024-03-01T00:00:00.000Z",
    },
    {
        ...base,
        _id: "2",
        title: "Elden Ring",
        status: "completed",
        genre: "role-playing",
        platform: "PC",
        rating: 4.5,
        price: "40.00",
        created_at: "2024-01-01T00:00:00.000Z",
    },
    {
        ...base,
        _id: "3",
        title: "Halo",
        status: "paused",
        genre: "shooter",
        platform: "Xbox One",
        rating: null,
        price: "20.00",
        created_at: "2024-02-01T00:00:00.000Z",
    },
    {
        ...base,
        _id: "4",
        title: "zelda breath",
        status: "playing",
        genre: "action",
        platform: "Nintendo Switch",
        rating: 3,
        price: null,
        created_at: "2024-04-01T00:00:00.000Z",
    },
];

describe("filterByTitle", () => {
    it("returns all games when title is empty", () => {
        expect(filterByTitle(games, "")).toHaveLength(games.length);
    });

    it("filters by prefix match (case-insensitive)", () => {
        const result = filterByTitle(games, "zel");
        expect(result).toHaveLength(2);
        expect(result.map((g) => g.title)).toEqual(["Zelda", "zelda breath"]);
    });

    it("is case-insensitive", () => {
        expect(filterByTitle(games, "ZEL")).toHaveLength(2);
    });

    it("returns an empty array when no titles match", () => {
        expect(filterByTitle(games, "xyz")).toHaveLength(0);
    });

    it("does not match mid-string — only prefix", () => {
        expect(filterByTitle(games, "Ring")).toHaveLength(0);
    });
});

describe("filterByStatus", () => {
    it("returns all games when status is 'all'", () => {
        expect(filterByStatus(games, "all")).toHaveLength(games.length);
    });

    it("filters to games with the matching status", () => {
        const result = filterByStatus(games, "playing");
        expect(result).toHaveLength(2);
        expect(result.every((g) => g.status === "playing")).toBe(true);
    });

    it("returns an empty array when no games match the status", () => {
        expect(filterByStatus(games, "dropped")).toHaveLength(0);
    });
});

describe("filterBySort", () => {
    it("sorts by most recently created first", () => {
        const result = filterBySort(games, "recently");
        expect(result[0].title).toBe("zelda breath");
        expect(result[result.length - 1].title).toBe("Elden Ring");
    });

    it("sorts alphabetically by title", () => {
        const result = filterBySort(games, "alphabetical");
        expect(result[0].title).toBe("Elden Ring");
        expect(result[result.length - 1].title).toBe("zelda breath");
    });

    it("sorts by rating descending, treating null as 0", () => {
        const result = filterBySort(games, "rated");
        expect(result[0].rating).toBe(5);
        expect(result[result.length - 1].rating).toBeNull();
    });

    it("sorts by price descending, treating null as 0", () => {
        const result = filterBySort(games, "price");
        expect(result[0].price).toBe("60.00");
        expect(result[result.length - 1].price).toBeNull();
    });

    it("does not mutate the original array", () => {
        const original = [...games];
        filterBySort(games, "alphabetical");
        expect(games.map((g) => g._id)).toEqual(original.map((g) => g._id));
    });
});
