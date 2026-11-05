// Reinicia el mundo con datos de ejemplo: npm run seed:example -- <autor> --yes
// BORRA todas las ciudades (con sus lugares) y todos los NPCs, y crea una ciudad, un lugar y un NPC de ejemplo.
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { City } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import { User } from '../models/user.model.js';

const args = process.argv.slice(2);
const author = args.find((a) => !a.startsWith('--'));
if (!author || !args.includes('--yes')) {
  console.error('Uso: npm run seed:example -- <autor> --yes   (borra todas las ciudades, lugares y NPCs)');
  process.exit(1);
}

await mongoose.connect(env.MONGODB_URI);
if (!(await User.exists({ username: author }))) {
  console.error(`❌ No existe el usuario "${author}"`);
  process.exit(1);
}

const now = new Date();
// Los extractos de ejemplo van publicados y con animación "Normal", un párrafo por fragmento
const version = (...paragraphs: string[]) => ({
  tale: paragraphs.map((text) => ({ text, animation: 'default' })),
  author,
  published: true,
  writeDate: now,
  publishDate: now,
});
const published = { published: true, publishDate: now, createdBy: author };

const deletedNpcs = await Npc.deleteMany({});
const deletedCities = await City.deleteMany({});

const city = await City.create({
  name: 'Valdoria',
  ...published,
  description: [
    version(
      'Un puerto de piedra blanca donde las mareas traen puertas que nadie dibujó.',
      'Sus calles bajan en escalones hacia el mar, y siempre huele a sal y a pan recién hecho.',
    ),
    version('Al caer la tarde, las casas se vuelven doradas y el puerto queda en silencio, como si escuchara.'),
  ],
  travel: [
    version('Cruzas el arco del muelle y la ciudad se abre frente a ti, blanca bajo la luz de la mañana.'),
    version('Llegas con la marea alta, y las puertas flotan a tu lado como pequeñas barcas que te acompañan.'),
  ],
  places: [
    {
      name: 'La taberna del ancla rota',
      ...published,
      description: [
        version('Una taberna de vigas bajas donde los marineros cuentan historias que nadie cree.'),
        version('El fuego nunca se apaga en su chimenea, y en la barra siempre hay un sitio libre para ti.'),
      ],
      entry: [
        version('Empujas la puerta y el murmullo de las conversaciones te envuelve como una manta.'),
        version('Al entrar, el tabernero levanta la vista y te saluda con un gesto, como si te esperara.'),
      ],
      events: [],
    },
  ],
});

const place = city.places[0]!;
const npc = await Npc.create({
  name: 'El cartógrafo ciego',
  npcType: 'story',
  placeId: place._id,
  author,
  published: true,
  publishDate: now,
  description: version('Un hombre de barba blanca que dibuja ciudades de memoria, con los ojos cerrados.'),
  meeting: version('Al pasar junto a su mesa, él inclina la cabeza como si te hubiera reconocido por los pasos.'),
  rejected: version('El cartógrafo vuelve a su dibujo y el rasgueo de la pluma llena el silencio.'),
  // Un NPC de tipo story: decisión de elegir con dos opciones, aceptar y rechazar
  decision: {
    decisionType: 'choose',
    options: [
      { name: 'Escuchar su historia', description: 'Te sientas junto a él y dejas que el relato llene el silencio.', value: '', published: true },
      { name: 'Marcharte', description: 'Das media vuelta antes de que termine la primera frase.', value: '', published: true },
    ],
  },
  items: [],
  chapters: [{ name: 'Inicio', story: [], endLocation: { endChapter: true } }],
});
place.events.push(npc._id);
await city.save();

console.log(`🗑️  Borradas ${deletedCities.deletedCount} ciudades y ${deletedNpcs.deletedCount} NPCs`);
console.log(`✅ Creada "${city.name}" → lugar "${place.name}" → NPC "${npc.name}" (autor: ${author})`);
await mongoose.disconnect();
