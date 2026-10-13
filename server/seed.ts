import mongoose from "mongoose";
import { Station } from "./src/models/Station.ts";
import { Bike } from "./src/models/Bike.ts";

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI fehlt. Seed mit docker compose exec server npm run seed starten.");
  }
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  await Bike.deleteMany({});
  await Station.deleteMany({});

  const station = await Station.create({
    name: "Station Berlin",
    rows: [
      { number: 1, capacity: 5, occupiedCount: 2 },
      { number: 2, capacity: 5, occupiedCount: 1 },
    ],
  });

  await Bike.insertMany([
    {
      brand: "Cube",
      type: "mountainbike",
      frameSize: "M",
      batteryLevel: null,
      status: "available",
      stationId: station._id,
      rowNumber: 1,
    },
    {
      brand: "Gazelle",
      type: "city",
      frameSize: "L",
      batteryLevel: null,
      status: "available",
      stationId: station._id,
      rowNumber: 1,
    },
    {
      brand: "Riese & Müller",
      type: "e-bike",
      frameSize: "M",
      batteryLevel: 85,
      status: "available",
      stationId: station._id,
      rowNumber: 2,
    },
  ]);

  console.log("Seed successful!");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
