import express from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup",  authController.signup);
router.post("/login",   authController.login);
router.post("/refresh", authController.refresh);   // uses HttpOnly cookie, no body needed
router.post("/logout",  authController.logout);    // uses HttpOnly cookie, no body needed
router.get("/me",       protect, authController.getMe);

export default router;