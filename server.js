import express from "express";
import "dotenv/config";

import { connectToDatabase } from "./models/database/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
	await connectToDatabase();
	console.log(`Server is running on port ${PORT}`);
});
