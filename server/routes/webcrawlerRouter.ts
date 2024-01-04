import express from "express";
import {
	// getWebcrawler,
	crawlController,
} from "../controllers/webcrawlerController";

const router = express.Router();

//Figure out the endpoint here
// router.get("/", getWebcrawler);

router.post("/", crawlController);
export default router;
