import { MongoMemoryReplSet } from "mongodb-memory-server";

let replSet: MongoMemoryReplSet;

export async function setup() {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    process.env.MONGO_URL = replSet.getUri();
}

export async function teardown() {
    await replSet.stop();
}
