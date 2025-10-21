
const { Schema, model } = require("mongoose");



const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    discipline: {
        type: String,
    },
    exercises: [String],
  },
);


const Workout = model("Workout", workoutSchema);

module.exports = Workout;


