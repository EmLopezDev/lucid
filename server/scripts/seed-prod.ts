import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { Types } from "mongoose";
import { mongoClientPromise, mongoDisconnect } from "../src/services/mongo";
import { UserModel } from "../src/models/user/user.mongo";
import { AuthModel } from "../src/models/auth/auth.mongo";
import { UserLibraryModel } from "../src/models/user-library/user-library.mongo";
import { ClubModel } from "../src/models/club/club.mongo";
import { ClubPostModel } from "../src/models/club-post/club-post.mongo";
import { libraryGames, clubs, clubPosts, FAKE_OWNERS, FAKE_USER_NAMES, FAKE_EMAILS } from "./seed-data";

const DEMO_EMAIL = "demo@lucid.com";
const DEMO_PASSWORD = "lucid-demo";

const sevenDaysFromNow = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

// Demo clubs are always private so only the demo account (a member of every
// seeded club) can see them — real production users never see or can join them.
const asPrivate = <T extends { visibility: string }>(club: T) => ({
    ...club,
    visibility: "private" as const,
    invite_code: randomBytes(6).toString("hex"),
    invite_code_expires_at: sevenDaysFromNow(),
});

const seedDemo = async () => {
    await mongoClientPromise;
    console.log("Connected to MongoDB");

    const existing = await UserModel.findOne({ email: DEMO_EMAIL });

    if (existing) {
        const oldClubs = await ClubModel.find(
            { "members._id": String(existing._id) },
            { _id: 1 },
        );
        const oldClubIds = oldClubs.map((club) => String(club._id));

        await Promise.all([
            AuthModel.deleteMany({ user_id: String(existing._id) }),
            UserLibraryModel.deleteMany({ user_id: String(existing._id) }),
            ClubModel.deleteMany({ "members._id": String(existing._id) }),
            ClubPostModel.deleteMany({ club_id: { $in: oldClubIds } }),
        ]);
        await UserModel.deleteOne({ _id: existing._id });
        await UserModel.deleteMany({ email: { $in: FAKE_EMAILS } });
        console.log("Removed existing demo user");
    }

    const user = await UserModel.create({
        first_name: "Demo",
        last_name: "User",
        email: DEMO_EMAIL,
        email_verified: true,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
    });

    const hash = await bcrypt.hash(DEMO_PASSWORD, 12);
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
    const insertedClubs = await ClubModel.insertMany(clubs(String(user._id)).map(asPrivate));

    const clubIdMap: Record<string, string> = {};
    for (const club of insertedClubs) {
        clubIdMap[club.name] = String(club._id);
    }

    const posts = clubPosts(String(user._id), clubIdMap);
    await ClubPostModel.insertMany(posts);

    console.log(`\nDemo seed complete`);
    console.log(`  Email:    ${DEMO_EMAIL}`);
    console.log(`  Password: ${DEMO_PASSWORD}`);
    console.log(`  Fake users: ${Object.keys(FAKE_USER_NAMES).length} created`);
    console.log(`  User Library Games: ${libraryGames("").length} entries`);
    console.log(`  Clubs:    ${clubs("").length} entries (all private, visible only to demo account)`);
    console.log(`  Posts:    ${posts.length} entries\n`);

    await mongoDisconnect();
};

seedDemo().catch((err) => {
    console.error("Demo seed failed:", err);
    process.exit(1);
});
