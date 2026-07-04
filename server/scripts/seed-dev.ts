import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { mongoClientPromise, mongoDisconnect } from "../src/services/mongo";
import { UserModel } from "../src/models/user/user.mongo";
import { AuthModel } from "../src/models/auth/auth.mongo";
import { UserLibraryModel } from "../src/models/user-library/user-library.mongo";
import { ClubModel } from "../src/models/club/club.mongo";
import { ClubPostModel } from "../src/models/club-post/club-post.mongo";
import { libraryGames, clubs, clubPosts, FAKE_OWNERS } from "./seed-data";

const SEED_EMAIL = "dev@lucid.com";
const SEED_PASSWORD = "password123";

const FAKE_USER_NAMES: Record<keyof typeof FAKE_OWNERS, [string, string]> = {
    alice:  ["Alice",  "Chen"],
    bob:    ["Bob",    "Torres"],
    carol:  ["Carol",  "Nguyen"],
    dave:   ["Dave",   "Patel"],
    eve:    ["Eve",    "Johnson"],
    frank:  ["Frank",  "Kim"],
    grace:  ["Grace",  "Williams"],
    henry:  ["Henry",  "Martinez"],
    iris:   ["Iris",   "Robinson"],
    jack:   ["Jack",   "Lee"],
    kate:   ["Kate",   "Brown"],
    liam:   ["Liam",   "Davis"],
    mia:    ["Mia",    "Garcia"],
    noah:   ["Noah",   "Wilson"],
    olivia: ["Olivia", "Anderson"],
};

const FAKE_EMAILS = Object.keys(FAKE_USER_NAMES).map((k) => `${k}@lucid.fake`);

const seed = async () => {
    await mongoClientPromise;
    console.log("Connected to MongoDB");

    const existing = await UserModel.findOne({ email: SEED_EMAIL });

    if (existing) {
        await Promise.all([
            AuthModel.deleteMany({ user_id: String(existing._id) }),
            UserLibraryModel.deleteMany({ user_id: String(existing._id) }),
            ClubModel.deleteMany({}),
            ClubPostModel.deleteMany({}),
        ]);
        await UserModel.deleteOne({ _id: existing._id });
        await UserModel.deleteMany({ email: { $in: FAKE_EMAILS } });
        console.log("Removed existing dev user");
    }

    const user = await UserModel.create({
        first_name: "Dev",
        last_name: "User",
        email: SEED_EMAIL,
        email_verified: true,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
    });

    const hash = await bcrypt.hash(SEED_PASSWORD, 12);
    await AuthModel.create({ user_id: String(user._id), hash });

    await UserModel.insertMany(
        (Object.entries(FAKE_USER_NAMES) as [keyof typeof FAKE_OWNERS, [string, string]][]).map(
            ([key, [first, last]]) => ({
                _id: new Types.ObjectId(FAKE_OWNERS[key]),
                first_name: first,
                last_name: last,
                email: `${key}@lucid.fake`,
                email_verified: true,
                created_at: new Date("2025-01-01"),
                updated_at: null,
                deleted_at: null,
            }),
        ),
    );

    await UserLibraryModel.insertMany(libraryGames(String(user._id)));
    const insertedClubs = await ClubModel.insertMany(clubs(String(user.id)));

    const clubIdMap: Record<string, string> = {};
    for (const club of insertedClubs) {
        clubIdMap[club.name] = String(club._id);
    }

    const posts = clubPosts(String(user._id), clubIdMap);
    await ClubPostModel.insertMany(posts);

    console.log(`\nSeed complete`);
    console.log(`  Email:    ${SEED_EMAIL}`);
    console.log(`  Password: ${SEED_PASSWORD}`);
    console.log(`  Fake users: ${Object.keys(FAKE_USER_NAMES).length} created`);
    console.log(`  User Library Games: ${libraryGames("").length} entries`);
    console.log(`  Clubs:    ${clubs("").length} entries`);
    console.log(`  Posts:    ${posts.length} entries\n`);

    await mongoDisconnect();
};

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
