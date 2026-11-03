const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Workout = require("../models/Workout.model");
const Discipline = require("../models/Discipline.model");

// Todas las rutas de workouts requieren usuario autenticado
router.use(isAuthenticated);

// Solo se aceptan los campos permitidos del body (nunca _id ni owner)
const pickWorkoutFields = ({ title, description, discipline, exercises }) => {
  const fields = { title, description, discipline, exercises };
  Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);
  return fields;
};

// Comprueba que la disciplina existe y pertenece al usuario
const isOwnDiscipline = async (disciplineId, owner) =>
  mongoose.isValidObjectId(disciplineId) &&
  Boolean(await Discipline.exists({ _id: disciplineId, owner }));

// ✅ POST /api/workouts - Crear un nuevo workout del usuario
router.post("/", async (req, res) => {
  const owner = req.payload._id;
  const fields = pickWorkoutFields(req.body);

  try {
    if (!(await isOwnDiscipline(fields.discipline, owner))) {
      return res.status(400).json({ message: "Invalid discipline" });
    }

    const newWorkout = await Workout.create({ ...fields, owner });
    res.status(201).json(newWorkout);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Error creating workout:", err);
    res.status(500).json({ message: "Error creating a new Workout in the DB" });
  }
});

// ✅ GET /api/workouts - Workouts del usuario (con filtro opcional por disciplina)
router.get("/", async (req, res) => {
  const { discipline } = req.query;
  const filter = { owner: req.payload._id };

  if (discipline) {
    if (!mongoose.isValidObjectId(discipline)) {
      return res.status(400).json({ message: "Invalid discipline id" });
    }
    filter.discipline = discipline;
  }

  try {
    const workouts = await Workout.find(filter).populate("discipline");
    res.json(workouts);
  } catch (err) {
    console.error("Error getting workouts:", err);
    res.status(500).json({ message: "Error getting workouts from the DB" });
  }
});

// ✅ GET /api/workouts/:workoutId - Obtener un workout del usuario
router.get("/:workoutId", async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.isValidObjectId(workoutId)) {
    return res.status(400).json({ message: "Invalid workout id" });
  }

  try {
    const workout = await Workout.findOne({ _id: workoutId, owner: req.payload._id }).populate("discipline");

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (err) {
    console.error("Error getting workout details:", err);
    res.status(500).json({ message: "Error getting Workout details from DB" });
  }
});

// ✅ PUT /api/workouts/:workoutId - Actualizar un workout del usuario
router.put("/:workoutId", async (req, res) => {
  const { workoutId } = req.params;
  const owner = req.payload._id;
  const fields = pickWorkoutFields(req.body);

  if (!mongoose.isValidObjectId(workoutId)) {
    return res.status(400).json({ message: "Invalid workout id" });
  }

  try {
    if (fields.discipline !== undefined && !(await isOwnDiscipline(fields.discipline, owner))) {
      return res.status(400).json({ message: "Invalid discipline" });
    }

    const updatedWorkout = await Workout.findOneAndUpdate({ _id: workoutId, owner }, fields, {
      new: true,
      runValidators: true,
    }).populate("discipline");

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(updatedWorkout);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Error updating workout:", err);
    res.status(500).json({ message: "Error updating workout in the DB" });
  }
});

// ✅ DELETE /api/workouts/:workoutId - Eliminar un workout del usuario
router.delete("/:workoutId", async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.isValidObjectId(workoutId)) {
    return res.status(400).json({ message: "Invalid workout id" });
  }

  try {
    const deleted = await Workout.findOneAndDelete({ _id: workoutId, owner: req.payload._id });

    if (!deleted) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).json({ message: "Error deleting Workout from the DB" });
  }
});

module.exports = router;
