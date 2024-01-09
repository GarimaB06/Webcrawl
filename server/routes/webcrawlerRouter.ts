import express from "express";
import { crawlController } from "../controllers/webcrawlerController";

const router = express.Router();
router.post("/", crawlController);
export default router;
