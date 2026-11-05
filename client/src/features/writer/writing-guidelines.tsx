import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QuillIcon } from '@/components/icons';

const GUIDELINES = [
  { title: 'Narrador omnisciente.', text: 'Lo sabe todo, salvo por las decisiones de quien juega.' },
  {
    title: 'Lugares sin historia propia.',
    text: 'Las descripciones de ciudades y lugares son generales y no pertenecen a una historia específica.',
  },
  { title: 'Siempre en presente.', text: 'Los hechos se cuentan a medida que el jugador los vive.' },
  {
    title: 'Lecturas que se repiten.',
    text: 'Las ciudades y lugares pueden relacionarse con historias concretas, pero se leen una y otra vez durante el juego: cuéntalos como eventos habituales.',
  },
  {
    title: 'El Peregrino, en segunda persona.',
    text: (
      <>
        Quien juega es <em>El Peregrino</em>, y el narrador se dirige a él como «tú».
      </>
    ),
  },
];

const AVOID = [
  { title: 'Diálogos específicos del Peregrino.', text: 'Mejor diálogos generales, como «Dices estar de acuerdo con entusiasmo».' },
  { title: 'Referencias a cosas que solo existen en nuestro mundo.' },
  {
    title: 'Viajes en el tiempo y problemas temporales.',
    text: 'Por ahora son complejos y se evalúa desarrollar tramas con bucles de historia.',
  },
  { title: 'Animales que hablan.', text: 'Puedes inventar cualquier criatura, pero los animales son los de nuestro mundo.' },
  { title: 'Idiomas inventados.', text: 'Puedes mencionar idiomas extranjeros, pero no intentar escribirlos.' },
];

/** Enlace "Sugerencias de escritura" bajo el logo, presente en todas las vistas de escritor. */
export function WritingGuidelines() {
  return (
    <Dialog>
      <DialogTrigger className="link-underline inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-serif text-[17px] text-ink-muted hover:text-ink">
        <QuillIcon width={18} height={18} strokeWidth={2.5} />
        Sugerencias de escritura
      </DialogTrigger>
      <DialogContent className="gap-7 px-[clamp(24px,6vw,52px)] pt-12 pb-11">
        <div className="flex flex-col gap-2.5">
          <DialogTitle>Sugerencias de escritura</DialogTitle>
          <DialogDescription>
            Puedes crear la historia que quieras en este mundo. Estas pautas ayudan a que todas compartan un mismo esquema
            narrativo.
          </DialogDescription>
        </div>

        <ol className="flex list-decimal flex-col gap-5 pl-7 text-[19px] leading-normal text-ink-soft">
          {GUIDELINES.map((item) => (
            <li key={item.title}>
              <span className="font-display text-2xl font-bold text-ink">{item.title}</span> {item.text}
            </li>
          ))}
        </ol>

        <section className="flex flex-col gap-4.5 border-t border-ink pt-6">
          <h3 className="font-display text-[32px] leading-none font-semibold">Evitemos</h3>
          <ul className="flex list-disc flex-col gap-4.5 pl-7 text-[19px] leading-normal text-ink-soft">
            {AVOID.map((item) => (
              <li key={item.title}>
                <span className="font-display text-[22px] font-bold text-ink">{item.title}</span>
                {item.text && <> {item.text}</>}
              </li>
            ))}
          </ul>
        </section>

        <DialogClose asChild>
          <Button size="md" className="min-h-13 self-start px-9 text-xl">
            Entendido
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
