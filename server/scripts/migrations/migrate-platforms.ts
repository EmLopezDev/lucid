// Applied: 2026-05-21 — local + production
import { mongoClientPromise, mongoDisconnect } from "../../src/services/mongo";
import { UserLibraryModel } from "../../src/models/user-library/user-library.mongo";

const PLATFORM_MIGRATION_MAP: Record<string, string> = {
    playstation: "PlayStation",
    xbox: "Xbox",
    nintendo: "Nintendo",
};

const migrate = async () => {
    await mongoClientPromise;
    console.log("Connected to MongoDB");

    let totalUpdated = 0;

    for (const [oldPlatform, newPlatform] of Object.entries(PLATFORM_MIGRATION_MAP)) {
        const result = await UserLibraryModel.collection.updateMany(
            { platform: oldPlatform },
            { $set: { platform: newPlatform } },
        );

        if (result.modifiedCount > 0) {
            console.log(
                `  "${oldPlatform}" → "${newPlatform}": ${result.modifiedCount} game(s) updated`,
            );
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
