// Borra disciplinas y workouts cuyo owner ya no existe en la colección users.
// Por defecto solo muestra lo que borraría. Para borrar, añade --apply:
//   npm run cleanup:orphans:prod -- --apply
const { getMongoUri } = require("./db-uri");
const mongoose = require("mongoose");

const apply = process.argv.includes("--apply");

(async () => {
  await mongoose.connect(getMongoUri());
  const db = mongoose.connection.db;
  console.log(`Connected to "${db.databaseName}"${apply ? "" : " (dry run, nothing will be deleted)"}`);

  const users = await db.collection("users").find({}, { projection: { email: 1 } }).toArray();
  console.log(`Users kept: ${users.map((u) => u.email).join(", ") || "none"}`);
  const userIds = users.map((u) => u._id);

  // Huérfanos: sin owner o con un owner que no está en users
  const orphanFilter = { $or: [{ owner: { $exists: false } }, { owner: { $nin: userIds } }] };

  for (const name of ["workouts", "disciplines"]) {
    const collection = db.collection(name);
    const count = await collection.countDocuments(orphanFilter);
    const kept = (await collection.countDocuments({})) - count;
    if (apply) {
      const { deletedCount } = await collection.deleteMany(orphanFilter);
      console.log(`${name}: deleted ${deletedCount}, kept ${kept}`);
    } else {
      console.log(`${name}: would delete ${count}, would keep ${kept}`);
    }
  }
})()
  .catch((err) => {
    console.error("Cleanup failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
