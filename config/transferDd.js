// future use if need data dumb into another db

import { MongoClient } from "mongodb";

const sourceUri = "mongodb://localhost:27017";
const destUri = "mongodb://localhost:27017";
const dbNameSource = "sourceDB";
const dbNameDest = "destinationDB";
const collectionName = "yourCollection";

const run = async () => {
  const sourceClient = new MongoClient(sourceUri);
  const destClient = new MongoClient(destUri);

  try {
    await sourceClient.connect();
    await destClient.connect();

    const sourceDb = sourceClient.db(dbNameSource);
    const destDb = destClient.db(dbNameDest);

    const sourceCollection = sourceDb.collection(collectionName);
    const destCollection = destDb.collection(collectionName);

    const data = await sourceCollection.find().toArray();

    if (data.length) {
      await destCollection.insertMany(data);
      console.log(
        `✅ Transferred ${data.length} documents from ${dbNameSource} to ${dbNameDest}`
      );
    } else {
      console.log("ℹ️ No data to transfer");
    }
  } catch (err) {
    console.error("❌ Error transferring data:", err);
  } finally {
    await sourceClient.close();
    await destClient.close();
  }
};

run();
