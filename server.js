import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import session from "express-session";
import passport from "./passport.js";

import { connectToDatabase } from "./models/database/index.js";
import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = JSON.parse(readFileSync("./swagger.json", "utf8"));

app.set("trust proxy", 1);

app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET || "secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	if (req.isAuthenticated()) {
		return res.send(
			`Todo API is running. You are logged in as ${req.user.username}. Go to /api-docs to see the documentation. Go to /logout to log out.`
		);
	}

	res.send(
		"Todo API is running. You are not logged in. Go to /login to log in with GitHub. Go to /api-docs to see the documentation."
	);
});

swaggerDocument.servers[0].url = `http://localhost:${PORT}`;

if (process.env.RENDER_EXTERNAL_URL) {
	swaggerDocument.servers.push({
		url: process.env.RENDER_EXTERNAL_URL,
		description: "Deployed server",
	});
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
	await connectToDatabase();
	console.log(`Server is running on port ${PORT}`);
});
