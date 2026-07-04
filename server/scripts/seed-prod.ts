import bcrypt from "bcryptjs";
import { mongoClientPromise, mongoDisconnect } from "../src/services/mongo";
import { UserModel } from "../src/models/user/user.mongo";
import { AuthModel } from "../src/models/auth/auth.mongo";
import { UserLibraryModel } from "../src/models/user-library/user-library.mongo";
import { ClubModel } from "../src/models/club/club.mongo";
import { libraryGames, clubs } from "./seed-data";

const DEMO_EMAIL = "demo@lucid.com";
const DEMO_PASSWORD = "lucid-demo";

const seedDemo = async () => {
    await mongoClientPromise;
    console.log("Connected to MongoDB");

    const existing = await UserModel.findOne({ email: DEMO_EMAIL });

    if (existing) {
        await Promise.all([
            AuthModel.deleteMany({ user_id: String(existing._id) }),
            UserLibraryModel.deleteMany({ user_id: String(existing._id) }),
            ClubModel.deleteMany({}),
        ]);
        await UserModel.deleteOne({ _id: existing._id });
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

    await UserLibraryModel.insertMany(libraryGames(String(user._id)));
    await ClubModel.insertMany(clubs(String(user._id)));

    console.log(`\nDemo seed complete`);
    console.log(`  Email:    ${DEMO_EMAIL}`);
    console.log(`  Password: ${DEMO_PASSWORD}`);
    console.log(`  User Library Games:    ${libraryGames("").length} entries\n`);
    console.log(`  Clubs:    ${clubs("").length} entries\n`);

    await mongoDisconnect();
};

seedDemo().catch((err) => {
    console.error("Demo seed failed:", err);
    process.exit(1);
});
