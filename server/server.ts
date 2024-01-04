import express from "express";
import cors from "cors";
import webcrawlerRouter from "./routes/webcrawlerRouter";

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello, Node.js with TypeScript!");
});

app.use("/", webcrawlerRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
