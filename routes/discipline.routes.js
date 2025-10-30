
const router = require('express').Router();
const Discipline = require('../models/Discipline.model');
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
router.delete('/:disciplineId', isAuthenticated, (req, res) => {
  Discipline.findByIdAndDelete(req.params.disciplineId)
    .then(() => {
      res.json({ message: "Discipline deleted successfully" });
    })
    .catch((err) => {
      console.error('Error deleting discipline:', err);
      res.status(500).json({status: 'error', message: 'Failed to delete discipline'});
    });
});

module.exports = router;