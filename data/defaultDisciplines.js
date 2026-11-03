// Disciplinas que se crean automáticamente para cada usuario nuevo al registrarse.
// Imágenes de Unsplash (Unsplash License, uso gratuito).
const img = (photoId) =>
  `https://images.unsplash.com/${photoId}?w=800&q=80&auto=format&fit=crop`;

const defaultDisciplines = [
  {
    name: "Running",
    description: "Track, road and trail runs: intervals, tempo runs and long distance.",
    imgUrl: img("photo-1744060204728-f68e434a3edf"),
  },
  {
    name: "Cycling",
    description: "Road and indoor cycling sessions to build endurance and power.",
    imgUrl: img("photo-1559235270-2df4dcfb4eca"),
  },
  {
    name: "Swimming",
    description: "Pool and open water swimming: technique drills and endurance sets.",
    imgUrl: img("photo-1519315901367-f34ff9154487"),
  },
  {
    name: "Gym",
    description: "Strength training with free weights and machines.",
    imgUrl: img("photo-1620188467120-5042ed1eb5da"),
  },
  {
    name: "Yoga",
    description: "Mobility, flexibility and breathing sessions for recovery.",
    imgUrl: img("photo-1767611115570-92e679b820ed"),
  },
  {
    name: "CrossFit",
    description: "High-intensity functional training: WODs, lifting and gymnastics.",
    imgUrl: img("photo-1517838277536-f5f99be501cd"),
  },
  {
    name: "Hyrox",
    description: "Running combined with functional stations like sled push, rowing and wall balls.",
    imgUrl: img("photo-1751456357786-68c278e9063c"),
  },
];

module.exports = defaultDisciplines;
