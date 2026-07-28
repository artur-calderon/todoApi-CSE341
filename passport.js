import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "./models/database/index.js";

const usersCollection = db.collection("users");

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await usersCollection.findOne({ githubId: profile.id });

				if (!user) {
					const newUser = {
						githubId: profile.id,
						username: profile.username,
						displayName: profile.displayName || profile.username,
					};

					const result = await usersCollection.insertOne(newUser);
					user = { _id: result.insertedId, ...newUser };
				}

				return done(null, user);
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

export default passport;
