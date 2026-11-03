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
      type: Schema.Types.ObjectId,
      ref: "Discipline",
      required: [true, "Discipline is required"],
    },
    exercises: {
      type: String,
      required: [true, "Exercises are required"],
    },
    // Usuario propietario: cada usuario solo ve y gestiona sus workouts
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = model("Workout", workoutSchema);

module.exports = Workout;
