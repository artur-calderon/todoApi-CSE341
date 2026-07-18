import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";

import { connectToDatabase } from "./models/database/index.js";
import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = JSON.parse(readFileSync("./swagger.json", "utf8"));

if (process.env.BASE_URL) {
	swaggerDocument.servers = [
		{
			url: process.env.BASE_URL,
			description: "Deployed server",
		},
	];
}

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Todo API is running. Go to /api-docs to see the documentation.");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
	await connectToDatabase();
	console.log(`Server is running on port ${PORT}`);
});
