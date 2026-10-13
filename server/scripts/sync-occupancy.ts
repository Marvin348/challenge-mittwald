import mongoose from "mongoose";
import { Bike } from "../src/models/Bike.ts";
import { Station } from "../src/models/Station.ts";

// Run with the backend stopped when migrating existing data.
try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.transaction(async (session) => {
    const stations = await Station.find().session(session);
    for (const station of stations) {
      for (const row of station.rows) {
        row.occupiedCount = await Bike.countDocuments({
          stationId: station._id, rowNumber: row.number, status: "available",
        }).session(session);
        if (row.occupiedCount > row.capacity) throw new Error("Station capacity exceeded");
      }
      await station.save({ session });
    }
  });
  console.log("Station occupancy synchronized.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
