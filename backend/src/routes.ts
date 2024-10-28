import { Router } from "express";

const newsRouter = Router();
import { generateNews } from "./logic/aggregate_news";

newsRouter.post("/get-news", generateNews);

export default newsRouter;
