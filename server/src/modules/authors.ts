import { City } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';

/**
 * Los relatos guardan el username del autor; al cambiarlo hay que actualizar
 * todas sus firmas para que siga pudiendo editar lo suyo.
 */
export async function renameAuthor(from: string, to: string) {
  const byAuthor = [{ 't.author': from }];
  await City.updateMany(
    {},
    {
      $set: {
        'description.$[t].author': to,
        'travel.$[t].author': to,
        'places.$[].description.$[t].author': to,
        'places.$[].entry.$[t].author': to,
      },
    },
    { arrayFilters: byAuthor },
  );
  await City.updateMany({ createdBy: from }, { $set: { createdBy: to } });
  await City.updateMany({}, { $set: { 'places.$[p].createdBy': to } }, { arrayFilters: [{ 'p.createdBy': from }] });

  await Npc.updateMany({ author: from }, { $set: { author: to } });
  for (const field of ['description', 'meeting', 'rejected'] as const) {
    await Npc.updateMany({ [`${field}.author`]: from }, { $set: { [`${field}.author`]: to } });
  }
  await Npc.updateMany({}, { $set: { 'chapters.$[t].author': to } }, { arrayFilters: byAuthor });
}
