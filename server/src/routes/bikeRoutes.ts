import { Router } from "express";
import { Bike } from "../models/Bike.ts";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, type, status } = req.query;

    const filter: Record<string, unknown> = {};

    if (typeof search === "string" && search.trim()) {
      filter.brand = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (typeof type === "string" && type) {
      filter.type = type;
    }

    if (status === "available" || status === "rented") {
      filter.status = status;
    }

    const bikes = await Bike.find(filter).lean();

    res.status(200).json(bikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bikes" });
  }
});

export default router;
