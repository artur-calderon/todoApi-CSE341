import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function connectToDatabase() {
	console.log("Connecting to MongoDB...");
	try {
		await client.connect();
		await client.db("admin").command({ ping: 1 });
		console.log("Successfully connected to MongoDB!");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
}

const db = client.db("todoAPI");

export { connectToDatabase, db };
