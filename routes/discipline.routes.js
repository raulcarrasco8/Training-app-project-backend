
const router = require('express').Router();
const mongoose = require('mongoose');
const Discipline = require('../models/Discipline.model');
const Workout = require('../models/Workout.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');    

// ✅ POST /api/disciplines - Crear una nueva disciplina
router.post('/', isAuthenticated, (req, res) => {
  Discipline.create(req.body)
    .then((newDiscipline) => {
      res.status(201).json(newDiscipline);
    })
    .catch((err) => {
      console.error('Error creating discipline:', err);
      res.status(500).json({status: 'error', message: 'Failed to create discipline'});
    });
});


// ✅ GET /api/disciplines - Obtener todas las disciplinas
router.get('/', (req, res) => {
  Discipline.find()
    .then((disciplinesFromDB) => {
      res.status(200).json(disciplinesFromDB);
    })
    .catch((err) => {
      console.error('Error fetching disciplines:', err);
      res.status(500).json({status: 'error', message: 'Failed to fetch disciplines'});
    });
});

// ✅ DELETE /api/disciplines/:disciplineId - Eliminar una disciplina por ID
// Se bloquea el borrado si la disciplina tiene workouts asociados,
// para no dejar workouts huérfanos (populate devolvería null).
router.delete('/:disciplineId', isAuthenticated, async (req, res) => {
  const { disciplineId } = req.params;

  if (!mongoose.isValidObjectId(disciplineId)) {
    return res.status(400).json({ message: 'Invalid discipline id' });
  }

  try {
    const discipline = await Discipline.findById(disciplineId);

    if (!discipline) {
      return res.status(404).json({ message: 'Discipline not found' });
    }

    const workoutCount = await Workout.countDocuments({ discipline: disciplineId });

    if (workoutCount > 0) {
      return res.status(409).json({
        message: `This discipline has ${workoutCount} workout(s). Delete or reassign them first.`,
        workoutCount,
      });
    }

    await discipline.deleteOne();
    res.json({ message: 'Discipline deleted successfully' });
  } catch (err) {
    console.error('Error deleting discipline:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete discipline' });
  }
});

module.exports = router;