import { readFile } from 'node:fs/promises';
import type Anthropic from '@anthropic-ai/sdk';
import { describe, expect, it } from 'vitest';
import { generateElement, loadContext, type Ask } from '../src/import/generate.js';
import { importWorld } from '../src/import/import-world.js';
import { worldFileSchema } from '../src/import/world-file.js';

/** El mundo de ejemplo, sin el final que lleva a Valdoria (en los tests no existe) */
const vado = async () => {
  const world = worldFileSchema.parse(JSON.parse(await readFile(new URL('../../docs/mundos/vado-ambar.json', import.meta.url), 'utf8')));
  for (const ch of world.cities[0]!.places[0]!.npcs[0]!.chapters) if (ch.end?.city === 'Valdoria') delete ch.end;
  return world;
};

/** Un modelo de mentira que responde, en orden, con los textos dados y guarda lo que recibió */
const fakeAsk = (answers: string[]) => {
  const calls: Anthropic.Beta.BetaMessageParam[][] = [];
  const ask: Ask = async (messages) => {
    calls.push([...messages]);
    const text = answers[calls.length - 1] ?? '';
    return { content: [{ type: 'text', text }], stop_reason: 'end_turn' } as unknown as Anthropic.Beta.BetaMessage;
  };
  return { ask, calls };
};
const lastUser = (call: Anthropic.Beta.BetaMessageParam[]) => String(call.at(-1)!.content);

describe('generación con Claude', () => {
  it('lee la ciudad y el lugar de destino para dar contexto', async () => {
    const world = await vado();
    await importWorld(world, { author: 'TellerIA', publish: true });

    const npc = await loadContext({ kind: 'npc', city: 'vado ámbar', place: 'Puente de los faroleros' });
    if ('issue' in npc) throw new Error(npc.issue.message);
    expect(npc.context).toContain('## La ciudad: Vado Ámbar');
    expect(npc.context).toContain(world.cities[0]!.travels[0]![0]!);
    expect(npc.context).toContain(world.cities[0]!.places[0]!.entries[1]![0]!);
    expect(npc.context).toContain('**Anciana con pértiga y farol** (Los faroles que se apagan)');

    const place = await loadContext({ kind: 'place', city: 'Vado Ámbar' });
    if ('issue' in place) throw new Error(place.issue.message);
    expect(place.context).toContain('Lugares que ya existen en la ciudad (no los repitas)');
    expect(place.context).not.toContain('Destinos posibles');

    expect(await loadContext({ kind: 'npc', city: 'Vado Ámbar', place: 'El faro' })).toEqual({
      issue: { level: 'error', path: 'place', message: 'No existe el lugar «El faro» en «Vado Ámbar»' },
    });
    expect(await loadContext({ kind: 'place', city: 'Atlántida' })).toMatchObject({ issue: { path: 'city' } });
  });

  it('valida lo generado y le pide al modelo que corrija hasta que no haya problemas', async () => {
    const world = await vado();
    await importWorld(world, { author: 'TellerIA', publish: true });
    const good = { ...world.cities[0]!.places[0]!.npcs[0]!, name: 'Barquero dormido en la proa' };
    // Primer intento: un final hacia una ciudad que no existe y un encuentro de un párrafo
    const bad = {
      ...good,
      city: 'Otra',
      meeting: [good.meeting.join(' ')],
      chapters: good.chapters.map((c) => (c.id === 'rio' ? { ...c, end: { city: 'Atlántida' } } : c)),
    };
    const { ask, calls } = fakeAsk(['Aquí va:\n```json\n' + JSON.stringify(bad) + '\n```', JSON.stringify(good)]);

    const result = await generateElement(
      { kind: 'npc', city: 'Vado Ámbar', place: 'Puente de los faroleros' },
      { ask, author: 'TellerIA', idea: 'un barquero que nunca despierta' },
    );
    expect(result).toMatchObject({ attempts: 2, issues: [], raw: { city: 'Vado Ámbar', place: 'Puente de los faroleros', name: good.name } });

    expect(lastUser(calls[0]!)).toContain('Idea: un barquero que nunca despierta');
    expect(lastUser(calls[0]!)).toContain('## El lugar: Puente de los faroleros');
    const fix = lastUser(calls[1]!);
    expect(fix).toContain('ERROR chapters[5].end: No existe la ciudad «Atlántida»');
    expect(fix).toMatch(/aviso .*meeting: 1 párrafos/);
  });

  it('se rinde si nunca llega a ser importable, y acepta avisos si no hay errores', async () => {
    const world = await vado();
    await importWorld(world, { author: 'TellerIA', publish: true });
    const target = { kind: 'place', city: 'Vado Ámbar' } as const;

    const never = fakeAsk(['no sé', '{"name": ""}']);
    await expect(generateElement(target, { ask: never.ask, author: 'TellerIA', attempts: 2 })).rejects.toThrow('No se consiguió un lugar válido en 2 intentos');
    expect(lastUser(never.calls[1]!)).toContain('ERROR (respuesta): La respuesta no contiene un objeto JSON');

    const { npcs: _npcs, ...place } = world.cities[0]!.places[0]!;
    const withWarning = { ...place, name: 'Muelle de los toneles', descriptions: ['Corto.', 'x'.repeat(320)] };
    const warned = fakeAsk([JSON.stringify(withWarning), JSON.stringify(withWarning)]);
    const result = await generateElement(target, { ask: warned.ask, author: 'TellerIA', attempts: 2 });
    // con avisos pide una corrección; si sigue igual, se queda con lo último que es importable
    expect(result.attempts).toBe(2);
    expect(lastUser(warned.calls[1]!)).toContain('aviso descriptions[1]');
    expect(result.issues).toEqual([expect.objectContaining({ level: 'warning', path: 'descriptions[1]' })]);
  });
});
