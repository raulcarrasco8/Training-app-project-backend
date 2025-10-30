
const {Schema, model} = require("mongoose");

const disciplineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    imgUrl: {
        type: String,
        required: [true, "Image is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Discipline = model("Discipline", disciplineSchema);

module.exports = Discipline;
