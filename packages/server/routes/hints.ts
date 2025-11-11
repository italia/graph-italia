import { Router } from "express";
import * as ai from "../lib/ai";
import { requireUser } from "../lib/middlewares";

const router = Router();

router.post("/", [requireUser], async (req: any, res: any, next: any) => {
  console.log("hints");
  try {
    const { body } = req;
    const results = await ai.getSuggestions(body);
    return res.json(results);
  } catch (err) {
    console.log("errore", err);
    next(err);
  }
});

export default router;
