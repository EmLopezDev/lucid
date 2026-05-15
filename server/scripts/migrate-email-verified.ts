import { mongoClientPromise, mongoDisconnect } from "../src/services/mongo";
import { UserModel } from "../src/models/user/user.mongo";

const migrate = async () => {
    await mongoClientPromise;
    console.log("Connected to MongoDB");

    const result = await UserModel.updateMany(
        { email_verified: { $ne: true } },
        { $set: { email_verified: true } },
    );

    console.log(`Updated ${result.modifiedCount} user(s) to email_verified: true`);

    await mongoDisconnect();
};

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
