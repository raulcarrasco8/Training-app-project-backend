

const router = require("express").Router();
const Workout = require("../models/Workout.model");



// ✅ POST /api/workouts - Crear un nuevo workout
router.post("/", (req, res) => {
  Workout.create(req.body)
    .then((newWorkout) => {
      res.status(201).json(newWorkout);
    })
    .catch((err) => {
      console.log("Error creating a new Workout in the DB...");
      console.log(err);
      res.status(500).json({ message: "Error creating a new Workout in the DB" });
    });
});


// ✅ GET /api/workouts - Obtener todos los workouts 
router.get("/", (req, res) => {
  Workout.find()
    .then((workoutFromDB) => {
      res.json(workoutFromDB);
    })
    .catch((err) => {
      console.log("Error getting workout from DB...");
      console.log(err);
      res.status(500).json({ message: "Error getting workout from the DB" });
    });
});


// ✅ GET /api/workouts/:workoutId - Obtener un workout por ID
router.get("/:workoutId", (req, res) => {
  Workout.findById(req.params.workoutIdId)
    .then((workoutFromDB) => {
      res.json(workoutFromDB);
    })
    .catch((err) => {
      console.log("Error getting Workout details from DB...");
      console.log(err);
      res.status(500).json({ message: "Error getting Workout details from DB" });
    });
});


// ✅ PUT /api/workouts/:workoutId - Actualizar un workout por ID
router.put("/:workoutId", (req, res) => {
  Workout.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
    .then((updatedWorkout) => {
      res.json(updatedWorkout);
    })
    .catch((err) => {
      console.log("Error updating workout in the DB...");
      console.log(err);
      res.status(500).json({ message: "Error updating workout in the DB" });
    });
});


// ✅ DELETE /api/workouts/:workoutId - Eliminar un workout por ID
router.delete("/:workoutId", (req, res) => {
  Workout.findByIdAndDelete(req.params.studentId)
    .then(() => {
      res.json({ message: "Workout deleted successfully" });
    })
    .catch((err) => {
      console.log("Error deleting Workout from the DB...");
      console.log(err);
      res.status(500).json({ message: "Error deleting Workout from the DB" });
    });
});


module.exports = router;