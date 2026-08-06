import express from "express";
import {
  generateExtensionToken,
  extensionStatus,
  checkResume        // <-- add
} from "../controllers/extensionController.js";

import { authMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.post("/token", authMiddleware, generateExtensionToken);

router.get("/status", authMiddleware, extensionStatus);

// NEW
router.get("/resume", authMiddleware, checkResume);

export default router;