// Applied: 2026-05-20 — local + production
import { mongoClientPromise, mongoDisconnect } from "../../src/services/mongo";
import { UserLibraryModel } from "../../src/models/user-library/user-library.mongo";

const GENRE_MIGRATION_MAP: Record<string, string> = {
    "action adventure": "action",
    survival: "other",
    "battle royal": "shooter",
    platform: "platformer",
};

const migrate = async () => {
    await mongoClientPromise;
    console.log("Connected to MongoDB");

    let totalUpdated = 0;

    for (const [oldGenre, newGenre] of Object.entries(GENRE_MIGRATION_MAP)) {
        const result = await UserLibraryModel.collection.updateMany(
            { genre: oldGenre },
            { $set: { genre: newGenre } },
        );

        if (result.modifiedCount > 0) {
            console.log(`  "${oldGenre}" → "${newGenre}": ${result.modifiedCount} game(s) updated`);
        }

        totalUpdated += result.modifiedCount;
    }

    if (totalUpdated === 0) {
        console.log("No documents required migration.");
    } else {
        console.log(`\nDone. ${totalUpdated} game(s) updated in total.`);
    }

    await mongoDisconnect();
};

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
