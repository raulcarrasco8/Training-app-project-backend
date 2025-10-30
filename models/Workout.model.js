
const { Schema, model, mongo, default: mongoose } = require("mongoose");



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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discipline",
        required: true,
    },
    exercises: { 
      type: String,
       required: [true, "Exercises are required"] 
    },
  },
);


const Workout = model("Workout", workoutSchema);

module.exports = Workout;


