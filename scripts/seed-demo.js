// Crea (o resetea) el usuario demo con disciplinas y workouts de ejemplo.
// Uso: npm run seed:demo (desarrollo) o npm run seed:demo:prod (producción)
// Solo toca los datos del usuario demo; el resto de usuarios no se modifica.
const { getMongoUri } = require("./db-uri");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Discipline = require("../models/Discipline.model");
const Workout = require("../models/Workout.model");
const defaultDisciplines = require("../data/defaultDisciplines");

const DEMO_USER = {
  email: "demo@trainingapp.dev",
  password: "Demo1234",
  name: "Demo Athlete",
};

// Workouts de ejemplo: disciplina, hace cuántos días, y contenido (ejercicios uno por línea)
const DEMO_WORKOUTS = [
  {
    discipline: "Running",
    daysAgo: 1,
    title: "Track intervals",
    description: "Speed session on the track to sharpen 5K pace.",
    exercises: "Warm-up jog 15 min\nDrills and strides 4 x 80 m\n10 x 400 m at 5K pace, 90 s rest\nCool-down jog 10 min",
  },
  {
    discipline: "Hyrox",
    daysAgo: 3,
    title: "Hyrox race simulation",
    description: "Half simulation to practise transitions between running and stations.",
    exercises: "1 km run + 1000 m SkiErg\n1 km run + 50 m sled push\n1 km run + 50 m sled pull\n1 km run + 80 m burpee broad jumps",
  },
  {
    discipline: "Gym",
    daysAgo: 4,
    title: "Lower body strength",
    description: "Heavy day focused on squat and posterior chain.",
    exercises: "Back squat 5 x 5\nRomanian deadlift 4 x 8\nWalking lunges 3 x 12 each leg\nCalf raises 3 x 15",
  },
  {
    discipline: "Swimming",
    daysAgo: 6,
    title: "Technique and endurance",
    description: "Pool session working on catch and breathing every three strokes.",
    exercises: "Warm-up 400 m easy\nCatch-up drill 6 x 50 m\nPull buoy 4 x 200 m\nCool-down 200 m backstroke",
  },
  {
    discipline: "Cycling",
    daysAgo: 7,
    title: "Sunday long ride",
    description: "Endurance ride on rolling roads, steady zone 2.",
    exercises: "90 km in zone 2\n2 climbs at threshold, 8 min each\nFuel every 30 min",
  },
  {
    discipline: "Yoga",
    daysAgo: 8,
    title: "Recovery mobility flow",
    description: "Easy session to loosen hips and hamstrings after the long ride.",
    exercises: "Sun salutation A x 5\nLow lunge with twist\nPigeon pose 2 min each side\nSupine twist and savasana",
  },
  {
    discipline: "Running",
    daysAgo: 10,
    title: "Tempo run",
    description: "Sustained effort just below threshold.",
    exercises: "Warm-up 2 km easy\n6 km at tempo pace\nCool-down 2 km easy",
  },
  {
    discipline: "CrossFit",
    daysAgo: 12,
    title: "WOD: Fran",
    description: "Classic benchmark, aiming to finish under 6 minutes.",
    exercises: "Warm-up: row 500 m and mobility\n21-15-9 thrusters at 43 kg\n21-15-9 pull-ups",
  },
  {
    discipline: "Gym",
    daysAgo: 14,
    title: "Upper body push and pull",
    description: "Balanced upper body session with supersets.",
    exercises: "Bench press 4 x 6\nWeighted pull-ups 4 x 6\nOverhead press 3 x 8\nBarbell row 3 x 10",
  },
  {
    discipline: "Running",
    daysAgo: 16,
    title: "Long run",
    description: "Easy aerobic run building up for the half marathon.",
    exercises: "18 km at easy pace\nLast 2 km at half marathon pace",
  },
  {
    discipline: "Hyrox",
    daysAgo: 19,
    title: "Sled and wall balls",
    description: "Station-specific work for the hardest part of the race.",
    exercises: "5 x 25 m heavy sled push\n5 x 25 m sled pull\n4 x 25 wall balls, 60 s rest",
  },
  {
    discipline: "Cycling",
    daysAgo: 21,
    title: "Indoor sweet spot",
    description: "Trainer session to build sustainable power.",
    exercises: "Warm-up 15 min\n3 x 12 min at 90% FTP, 5 min easy between\nCool-down 10 min",
  },
];

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(18, 0, 0, 0);
  return date;
};

async function seedDemo() {
  await mongoose.connect(getMongoUri());
  console.log(`Connected to "${mongoose.connection.name}"`);

  // 1. Usuario demo: se crea si no existe y se le restablece la contraseña
  const hashedPassword = bcrypt.hashSync(DEMO_USER.password, 10);
  const user = await User.findOneAndUpdate(
    { email: DEMO_USER.email },
    { email: DEMO_USER.email, name: DEMO_USER.name, password: hashedPassword },
    { upsert: true, new: true, runValidators: true }
  );

  // 2. Borrar los datos anteriores del demo (solo los suyos)
  const deletedWorkouts = await Workout.deleteMany({ owner: user._id });
  const deletedDisciplines = await Discipline.deleteMany({ owner: user._id });
  console.log(`Removed ${deletedWorkouts.deletedCount} workouts and ${deletedDisciplines.deletedCount} disciplines`);

  // 3. Disciplinas por defecto
  const disciplines = await Discipline.insertMany(
    defaultDisciplines.map((discipline) => ({ ...discipline, owner: user._id }))
  );
  const disciplineIdByName = Object.fromEntries(disciplines.map((d) => [d.name, d._id]));

  // 4. Workouts con fechas repartidas en las últimas semanas.
  // Se validan con Mongoose y se insertan directamente para conservar createdAt.
  const workoutDocs = [];
  for (const { discipline, daysAgo: days, ...fields } of DEMO_WORKOUTS) {
    const date = daysAgo(days);
    const doc = new Workout({ ...fields, discipline: disciplineIdByName[discipline], owner: user._id });
    await doc.validate();
    workoutDocs.push({ ...doc.toObject(), createdAt: date, updatedAt: date });
  }
  await Workout.collection.insertMany(workoutDocs);

  console.log(`Demo ready: ${disciplines.length} disciplines and ${workoutDocs.length} workouts`);
  console.log(`Log in with ${DEMO_USER.email} / ${DEMO_USER.password}`);
}

seedDemo()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
