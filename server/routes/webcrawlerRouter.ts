import express from "express";
import { getWebcrawler } from "../controllers/webcrawlerController";

const router = express.Router();

router.get("/", getWebcrawler);

export default router;
