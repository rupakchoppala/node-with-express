import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import movieModel from "../Models/movieModel.js";

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Connection error:", error));

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

const deleteMovies = async () => {
  try {
    await movieModel.deleteMany();
    console.log("Data successfully deleted");
  } catch (error) {
    console.error("Error during deletion:", error.message);
  } finally {
    process.exit();
  }
};

const importMovies = async () => {
  try {
    console.log("Existing documents count:", await movieModel.countDocuments());
    await movieModel.create(movies);
    console.log("Data successfully imported");
  } catch (error) {
    console.error("Error during import:", error.message);
  } finally {
    process.exit();
  }
};

if (process.argv.includes("--import")) {
  console.log("Importing data...");
  importMovies();
} else if (process.argv.includes("--delete")) {
  console.log("Deleting data...");
  deleteMovies();
} else {
  console.log("No valid operation provided. Use --import or --delete.");
  process.exit();
}
