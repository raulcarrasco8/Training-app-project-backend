const router = require("express").Router();
const mongoose = require("mongoose");
const Discipline = require("../models/Discipline.model");
const Workout = require("../models/Workout.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Todas las rutas de disciplinas requieren usuario autenticado
router.use(isAuthenticated);

// ✅ POST /api/disciplines - Crear una nueva disciplina del usuario
router.post("/", async (req, res) => {
  // Solo se aceptan los campos permitidos; el owner sale siempre del token
  const { name, description, imgUrl } = req.body;

  try {
    const newDiscipline = await Discipline.create({
      name,
      description,
      imgUrl,
      owner: req.payload._id,
    });
    res.status(201).json(newDiscipline);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Error creating discipline:", err);
    res.status(500).json({ message: "Failed to create discipline" });
  }
});

// ✅ GET /api/disciplines - Obtener las disciplinas del usuario
router.get("/", async (req, res) => {
  try {
    const disciplines = await Discipline.find({ owner: req.payload._id });
    res.status(200).json(disciplines);
  } catch (err) {
    console.error("Error fetching disciplines:", err);
    res.status(500).json({ message: "Failed to fetch disciplines" });
  }
});

// ✅ PUT /api/disciplines/:disciplineId - Actualizar una disciplina del usuario
router.put("/:disciplineId", async (req, res) => {
  const { disciplineId } = req.params;

  if (!mongoose.isValidObjectId(disciplineId)) {
    return res.status(400).json({ message: "Invalid discipline id" });
  }

  // Solo se aceptan los campos permitidos (nunca _id ni owner)
  const { name, description, imgUrl } = req.body;
  const fields = { name, description, imgUrl };
  Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

  try {
    // 404 tanto si no existe como si es de otro usuario (no revelamos que existe)
    const updatedDiscipline = await Discipline.findOneAndUpdate(
      { _id: disciplineId, owner: req.payload._id },
      fields,
      { new: true, runValidators: true }
    );

    if (!updatedDiscipline) {
      return res.status(404).json({ message: "Discipline not found" });
    }

    res.json(updatedDiscipline);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Error updating discipline:", err);
    res.status(500).json({ message: "Failed to update discipline" });
  }
});

// ✅ DELETE /api/disciplines/:disciplineId - Eliminar una disciplina del usuario
// Se bloquea el borrado si la disciplina tiene workouts asociados,
// para no dejar workouts huérfanos (populate devolvería null).
router.delete("/:disciplineId", async (req, res) => {
  const { disciplineId } = req.params;
  const owner = req.payload._id;

  if (!mongoose.isValidObjectId(disciplineId)) {
    return res.status(400).json({ message: "Invalid discipline id" });
  }

  try {
    // 404 tanto si no existe como si es de otro usuario (no revelamos que existe)
    const discipline = await Discipline.findOne({ _id: disciplineId, owner });

    if (!discipline) {
      return res.status(404).json({ message: "Discipline not found" });
    }

    const workoutCount = await Workout.countDocuments({ discipline: disciplineId, owner });

    if (workoutCount > 0) {
      return res.status(409).json({
        message: `This discipline has ${workoutCount} workout(s). Delete or reassign them first.`,
        workoutCount,
      });
    }

    await discipline.deleteOne();
    res.json({ message: "Discipline deleted successfully" });
  } catch (err) {
    console.error("Error deleting discipline:", err);
    res.status(500).json({ message: "Failed to delete discipline" });
  }
});

module.exports = router;
