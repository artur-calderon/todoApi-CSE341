import { Router } from "express";
import passport from "../passport.js";

const router = Router();

router.get("/login", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
	"/github/callback",
	passport.authenticate("github", {
		failureRedirect: "/api-docs",
		successRedirect: "/",
	})
);

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

router.get("/user", (req, res) => {
	if (req.isAuthenticated()) {
		return res.status(200).json({
			message: "You are logged in",
			user: req.user,
		});
	}

	res.status(401).json({
		message: "You are not logged in",
	});
});

export default router;
