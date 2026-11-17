<!-- Encargo: un NPC para «Puente de los faroleros» de «Vado Ámbar».
     Pega todo este archivo en un chat con un modelo y guarda su respuesta (solo el JSON) en un archivo .json.
     Después, desde server/: npm run import:npc -- <respuesta.json> --city="vado ámbar" --place="Puente de los faroleros" --dry-run
     Si el validador encuentra problemas, pásale la lista al modelo y pídele que corrija solo eso y devuelva el JSON completo. -->

Eres escritor de World of Stories, un juego de lectura en el que el Peregrino viaja por ciudades y lugares y se encuentra con NPCs que le cuentan historias.

Escribe en español, como narrador omnisciente, en presente, dirigiéndote al Peregrino en segunda persona y sin darle diálogo directo, siguiendo al pie de la letra la guía y el formato de la plantilla.

Lo que escribas debe tener sentido en el lugar donde se crea: usa la ciudad y el lugar que se te describen (su historia, sus oficios, su clima, sus nombres) y no repitas lo que ya existe.

Responde solo con el JSON, sin comentarios ni texto alrededor.

# Guía

# Guía de escritura automática

Pautas para generar ciudades, lugares, NPCs e historias de World of Stories de forma automática (por ejemplo, con un
modelo de lenguaje) y cargarlas en el juego. Sirve a la vez como **instrucciones para quien genera** y como
**contrato del formato** que entiende el importador.

```
1. Planificar   →  2. Escribir el JSON  →  3. Validar (--dry-run)  →  4. Importar en borrador  →  5. Revisar en /write y publicar
```

---

## 1. Voz narrativa (vale para todo)

| Regla | Cómo se aplica |
| --- | --- |
| **Narrador omnisciente** | Lo sabe todo (lo que piensan los personajes, la historia del lugar), salvo las decisiones de quien juega. |
| **Siempre en presente** | Los hechos ocurren mientras se leen: «La puerta cede», no «La puerta cedió». |
| **El Peregrino, en segunda persona** | El narrador le habla de «tú»: «Cruzas el umbral», «Sientes el frío». Los demás lo llaman *Peregrino* o *el Peregrino*. |
| **El Peregrino no tiene diálogo directo** | Solo respuestas indirectas: «Cuentas tu historia», «Argumentas tu opinión», «Respondes con desacuerdo». Nunca «—Estoy de acuerdo —dices». |
| **Los demás personajes sí hablan** | Con diálogo directo, entre «comillas angulares» o con raya: «Nadie cruza el puente de noche», advierte el guardia. |

> **«En primera persona»** (entradas, encuentros): se entiende como *vivido desde el Peregrino*: lo que ve, oye, huele
> y siente, contado en segunda persona por el narrador. Nunca «yo entré», siempre «entras».

### Evitemos

- Referencias a cosas que solo existen en nuestro mundo (marcas, países, personajes históricos, tecnología moderna).
- Viajes en el tiempo y problemas temporales.
- Animales que hablan (se pueden inventar criaturas; los animales son los de nuestro mundo).
- Idiomas inventados escritos (se pueden mencionar, no transcribir).
- Ciudades y lugares atados a una historia concreta: **se leen una y otra vez**, así que se cuentan como lo habitual
  del lugar, no como un suceso único.

---

## 2. Qué escribir

Un **párrafo** es una unidad de lectura: en el juego aparece como un fragmento con su animación. Separa las ideas en
párrafos de 150–500 caracteres; evita párrafos de una línea salvo para un golpe de efecto.

### Ciudades

| Campo | Pauta |
| --- | --- |
| Nombre | 1–3 palabras. |
| Descripción | 1 párrafo, **≤ 300 caracteres**. Arquitectónica o histórica. |
| Viaje | 4–8 párrafos (**1000–4000 caracteres**). La llegada del Peregrino: imágenes visuales de la ciudad, lugares característicos, rasgos históricos y culturales. |

### Lugares

| Campo | Pauta |
| --- | --- |
| Nombre | 1–4 palabras. |
| Descripción | 1 párrafo, **≤ 300 caracteres**. Visual o histórica. |
| Entrada | 3–6 párrafos (**900–3000 caracteres**). La llegada del Peregrino al lugar, con imágenes visuales y sensoriales, y lo que encuentra dentro. |

### NPCs y eventos

| Campo | Pauta |
| --- | --- |
| Nombre | 2–6 palabras que describan **lo observable** de forma condensada: «Pescadores remendando redes», «Protesta frente al cabildo». |
| Título (opcional) | El nombre de la historia, ≤ 120 caracteres. |
| Descripción | 1 párrafo, **≤ 300 caracteres**: lo que se ve desde el lugar, antes de acercarse. |
| Encuentro | 3–8 párrafos (**900–5000 caracteres**). El acercamiento del Peregrino, con imágenes visuales y sensoriales y diálogos. **Termina en una pregunta o una situación de decisión.** |
| Opción de aceptar | Título (la acción) + descripción **≤ 250 caracteres** (la acción, lo que se piensa o sus consecuencias). Lleva al capítulo inicial. |
| Opción de rechazar | Igual que aceptar. |
| Rechazo | 3–6 párrafos. Coherente con la opción de rechazar y con el encuentro: la consecuencia, la despedida y la separación. |

**Coherencia con el lugar:** pescadores en el puerto, una protesta en la plaza, una partida de cartas en la taberna.
El NPC tiene que poder estar ahí cualquier día.

### Capítulos

| Campo | Pauta |
| --- | --- |
| Nombre | Corto y evocador (≤ 80 caracteres). |
| Texto | 6–18 párrafos (**1000–12000 caracteres**). Profundiza en la historia y el problema del NPC, con imágenes visuales y sensoriales, diálogos y otros personajes. |
| Decisión | Si no es final: **termina en una pregunta o situación de decisión** y tiene **2 opciones** (título + descripción ≤ 250 caracteres). |
| Final | Sin opciones. Termina en el lugar del NPC (por defecto) o en otra ciudad o lugar. Cierra el relato: la consecuencia de las decisiones y la despedida. |

---

## 3. El árbol de capítulos

Cada decisión abre dos caminos, así que los capítulos forman un árbol. Un relato debe tener **entre 3 y 10 capítulos
desde el inicio hasta cualquier final** (contando ambos).

```
                    Inicio                    nivel 1  (1 capítulo)
                 ┌────┴────┐
                 A         B                  nivel 2  (2 capítulos)
               ┌─┴─┐     ┌─┴─┐
              A1   A2   B1   B2               nivel 3  (4 finales)
```

Un árbol completo de 3 niveles tiene **7 capítulos y 4 finales**; de 4 niveles, 15 capítulos y 8 finales. Para relatos
largos sin multiplicar el trabajo, **las ramas pueden converger**: una opción puede llevar a un capítulo al que también
llega otra rama, siempre que **ninguna decisión vuelva atrás** (no se permiten ciclos).

```
        Inicio
       ┌──┴──┐
       A     B
       └──┬──┘
          C            ← A y B convergen
       ┌──┴──┐
      C1     C2        ← finales
```

**Finales:** vuelven al lugar del NPC (lo habitual) o llevan al Peregrino a otro lugar o ciudad, que debe existir.

---

## 4. Animaciones

| Texto | Animación |
| --- | --- |
| Ciudades, lugares y NPCs (descripción, viaje, entrada, encuentro, rechazo) | Siempre **Normal**: el importador la pone sola. |
| Capítulos | Por párrafo. Un texto suelto es **Normal**; para otra, usa `{ "text": "…", "animation": "…" }`. |

En capítulos, con moderación:

| Valor | Efecto | Úsalo para |
| --- | --- | --- |
| `default` | Se escribe letra a letra | La narración |
| `chatA` | Bocadillo que entra por la izquierda | Lo que dice el personaje principal del relato |
| `chatB` | Bocadillo que entra por la derecha | Un segundo personaje que le responde |
| `surprise` | Se escribe y tiembla al final | Un giro o golpe de efecto (frases cortas) |
| `title` | Grande, centrado, con fundido | Un cambio de escena o de tiempo dentro del capítulo |
| `paragraph` | Aparece entero con un fundido | Textos escritos dentro de la historia: una carta, una inscripción |

El título de cada ciudad, lugar, NPC y capítulo se escribe solo antes del texto: no lo repitas en el primer párrafo.

---

## 5. Formato de los archivos

Se puede generar **todo un mundo** de una vez o **cada pieza por separado**. Hay una plantilla de cada tipo en
[`plantillas/`](plantillas/):

| Archivo | Qué trae | Plantilla |
| --- | --- | --- |
| Mundo | `cities` → lugares → NPCs → capítulos | [`mundo.json`](plantillas/mundo.json) |
| Ciudad | Una ciudad: `name`, `descriptions`, `travels` (y, si se quiere, `places`) | [`ciudad.json`](plantillas/ciudad.json) |
| Lugar | Un lugar + `city`: el nombre de su ciudad, que debe existir | [`lugar.json`](plantillas/lugar.json) |
| NPC | Un NPC con sus capítulos + `city` y `place`, que deben existir | [`npc.json`](plantillas/npc.json) |

Por separado, el orden natural es ciudad → lugares → NPCs: cada pieza se genera con la anterior ya cargada, y el
modelo puede recibir su descripción como contexto.

El formato del mundo completo (los archivos sueltos usan los mismos campos de cada nivel):

```jsonc
{
  "cities": [
    {
      "name": "Puerto Ceniza",
      "descriptions": ["Un párrafo…", "Otra versión…"],        // versiones: el juego muestra una al azar
      "travels": [["Párrafo 1", "Párrafo 2", "…"]],            // cada versión es una lista de párrafos
      "places": [
        {
          "name": "El mercado de humo",
          "descriptions": ["Un párrafo…"],
          "entries": [["Párrafo 1", "…"]],
          "npcs": [
            {
              "name": "Vendedora de mapas ciegos",
              "title": "Los mapas en blanco",                  // opcional
              "description": "Un párrafo…",                   // una sola versión
              "meeting": ["Párrafo 1", "…", "¿…?"],
              "accept": { "name": "Mirar sus mapas", "description": "…" },
              "reject": { "name": "Seguir de largo", "description": "…" },
              "rejected": ["Párrafo 1", "…"],
              "chapters": [                                    // el primero es el inicial
                {
                  "id": "inicio",                              // clave local: solo para enlazar opciones
                  "name": "Los mapas en blanco",
                  "text": ["Párrafo…", { "text": "«Nadie los compra», dice.", "animation": "chatA" }, "¿…?"],
                  "options": [
                    { "name": "Comprar un mapa", "description": "…", "to": "mapa" },
                    { "name": "Preguntar por su origen", "description": "…", "to": "origen" }
                  ]
                },
                { "id": "mapa", "name": "…", "text": ["…"], "end": { "city": "Valdoria", "place": "La taberna del ancla rota" } },
                { "id": "origen", "name": "…", "text": ["…"] }   // final sin `end`: vuelve al lugar del NPC
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

- **Varias versiones:** `descriptions`, `travels` y `entries` aceptan varias. El juego elige una al azar en cada visita,
  así que conviene generar **2–3 versiones** de cada una: más variedad con poco esfuerzo.
- **Ciudades y lugares existentes:** si el nombre ya existe, no se duplica: se le **añaden** las versiones nuevas
  (y los NPCs, en sus lugares). Sus textos solo son obligatorios para crearlos: en un mundo, una ciudad o un lugar que
  ya existe puede venir sin `descriptions` ni `travels`/`entries`, solo como contenedor. Así, importar un archivo de
  ciudad con un nombre existente le suma versiones nuevas de su descripción y su viaje.
- **`end`:** `{ "city" }` termina en una ciudad; `{ "place" }`, en un lugar de la ciudad del NPC; `{ "city", "place" }`,
  en un lugar de otra ciudad. Los nombres deben existir en el archivo o en el juego.
- **Límites técnicos:** nombres ≤ 80 caracteres, títulos de NPC ≤ 120, descripciones de opciones ≤ 500 (la guía
  pide ≤ 250), párrafos ≤ 5000 caracteres, hasta 10 opciones por capítulo (la guía pide 2).

---

## 6. Validar e importar

Desde `server/`:

```bash
npm run import:world -- ../mundo.json --dry-run     # solo valida
npm run import:world -- ../mundo.json               # importa en borrador
npm run import:world -- ../mundo.json --publish     # importa y publica
npm run import:city  -- ../ciudad.json              # una ciudad
npm run import:place -- ../lugar.json               # un lugar en una ciudad existente
npm run import:npc   -- ../npc.json                 # un NPC con sus capítulos en un lugar existente
```

| Opción | Efecto |
| --- | --- |
| `--dry-run` | Valida y resuelve los nombres contra el juego, sin escribir nada. |
| `--publish` | Publica lo importado. Las ciudades y lugares que ya existían conservan su estado. |
| `--strict` | Los avisos también impiden importar. |
| `--author=<usuario>` | Firma con otro usuario existente en lugar de TellerIA. |
| `--city=<ciudad>` | Lugar y NPC: la ciudad de destino. Manda sobre el `city` del archivo. |
| `--place=<lugar>` | NPC: el lugar de destino. Manda sobre el `place` del archivo. |

### Generar con Claude

Sin archivo, `import:place` e `import:npc` escriben el elemento con Claude (`claude-opus-5-5`) en el destino indicado:

```bash
npm run import:place -- --city="Vado Ámbar" --idea="un muelle donde se cargan los toneles de resina"
npm run import:npc   -- --city="Vado Ámbar" --place="Puente de los faroleros" --idea="un músico que toca para el río"
```

1. **Lee el destino de la base:** la descripción y el viaje de la ciudad, la descripción y la entrada del lugar, los
   lugares y NPCs que ya existen (para no repetirlos) y, para un NPC, los destinos posibles de sus finales.
2. **Lo escribe** siguiendo esta guía y la plantilla del tipo, con la `--idea` si se da (si no, la elige el modelo).
3. **Lo valida** como el importador. Si hay errores o avisos, le pasa la lista al modelo para que los corrija
   (hasta 3 intentos). Si al final quedan avisos, se queda con la última versión importable.
4. **Guarda el JSON** en `docs/mundos/generados/` (o en `--out=<archivo>`), para revisarlo o reimportarlo, y lo
   importa como cualquier archivo: en borrador, o publicado con `--publish`. Con `--dry-run` solo lo genera y lo guarda.

| Opción | Efecto |
| --- | --- |
| `--idea=<texto>` | De qué trata el lugar o la historia del NPC. |
| `--effort=<nivel>` | `low`, `medium` (por defecto), `high`, `xhigh` o `max`: más esfuerzo, más calidad y más coste. |
| `--out=<archivo>` | Dónde guardar el JSON generado. |

Hace falta una clave de la API de Anthropic en `server/.env` (`ANTHROPIC_API_KEY=…`) o una sesión de `ant auth login`.
Cada ejecución tiene coste. Si el modelo rechaza la petición, la API la repite automáticamente en otro modelo.

En PowerShell, `npm run` puede tragarse las opciones que van tras `--`; ahí usa el script directamente, con el tipo
como primer argumento: `npx tsx src/scripts/import-world.ts npc ../npc.json --dry-run`.

**Autoría: TellerIA.** Todo lo generado se firma por defecto como **TellerIA**, un autor genérico para los relatos
escritos por un modelo. Se crea solo la primera vez que se importa, como escritor sin contraseña conocida: nadie inicia
sesión con él. Sus relatos los gestiona un admin desde la sección de escritor (editar, publicar o borrar), y los
lectores ven «Por *TellerIA*».

El validador distingue:

- **Errores** (no se importa nada): falta un campo, un capítulo repetido o inexistente, un ciclo, un recorrido que
  nunca llega a un final, un `end` que apunta a una ciudad o un lugar que no existe.
- **Avisos** (se importa igual): lo que se sale de esta guía. Palabras por nombre, párrafos y caracteres de cada texto,
  descripciones de más de un párrafo, opciones que no son 2, recorridos de menos de 3 o más de 10 capítulos,
  capítulos inalcanzables, encuentros y capítulos sin «?» al final, y dos sospechas de estilo: diálogo directo del
  Peregrino («…», *dices*) y narración en primera persona o en pasado.

Importar en borrador permite revisarlo en la sección de escritor antes de publicar.

---

## 7. Cómo generarlo bien (y rápido)

1. **Primero el plan, luego la prosa.** Pide al modelo un esquema: el conflicto del NPC, el árbol (nombre y
   resumen de una línea de cada capítulo, a dónde lleva cada opción) y dónde termina cada final. Revisa el árbol
   antes de escribir: es barato corregirlo ahí.
2. **Un capítulo por petición.** Para escribir un capítulo, pásale al modelo el resumen del NPC, el camino que lleva
   hasta él (los resúmenes de los capítulos anteriores y la opción elegida en cada uno) y las dos opciones con las
   que debe terminar. Así cada rama es coherente sin cargar todo el texto anterior.
3. **Las opciones salen del texto.** El último párrafo plantea la decisión; las dos opciones son sus respuestas
   posibles, con consecuencias distintas (no dos versiones de lo mismo).
4. **Versiones, no copias.** Las versiones de una descripción o un viaje cuentan lo mismo de otra manera (otra hora
   del día, otra estación, otro detalle), sin contradecirse.
5. **Valida en cada paso.** `--dry-run` señala exactamente qué campo se sale de la guía (`cities[0].places[1].npcs[0].meeting: 2 párrafos…`):
   pide al modelo que corrija solo ese campo.

### Plantilla de instrucciones para un modelo

> Eres escritor de World of Stories. Sigue la guía adjunta (`docs/guia-escritura-automatica.md`).
> Escribe en español, como narrador omnisciente, en presente, dirigiéndote al Peregrino en segunda persona y sin darle
> diálogo directo. Devuelve **solo** un JSON válido con el formato de la plantilla adjunta
> (`plantillas/{mundo|ciudad|lugar|npc}.json`), sin comentarios.

Y el encargo, según lo que se genere:

| Tipo | Encargo |
| --- | --- |
| Ciudad | Una ciudad {idea: clima, época, oficio principal, rasgo histórico}. 2 versiones de la descripción y 2 del viaje. |
| Lugar | Un lugar de «{ciudad}» ({descripción de la ciudad}): {idea}. 2 versiones de la descripción y 2 de la entrada. |
| NPC | Un NPC o evento para «{lugar}» de «{ciudad}» ({descripción del lugar}). Su historia: {idea}. Árbol de {niveles} niveles, con los finales en {destinos}. |

---

## 8. Lista de verificación

- [ ] Nombres con el número de palabras de la guía; los de NPC describen lo que se ve.
- [ ] Descripciones de un párrafo y ≤ 300 caracteres.
- [ ] Viajes, entradas, encuentros, rechazos y capítulos dentro de sus párrafos y caracteres.
- [ ] Todo en presente, omnisciente, con el Peregrino en segunda persona y sin diálogo directo.
- [ ] El encuentro y cada capítulo no final terminan en una decisión, y sus 2 opciones responden a ella.
- [ ] El rechazo continúa el encuentro y cierra con la despedida.
- [ ] Cada recorrido tiene 3–10 capítulos, sin ciclos, y cada final sabe dónde termina.
- [ ] Nada de nuestro mundo, viajes en el tiempo, animales que hablan ni idiomas inventados escritos.
- [ ] `npm run import:<world|city|place|npc> -- … --dry-run` sin errores (y, a ser posible, sin avisos).


# Plantilla (npc.json)

{
  "city": "Valdoria",
  "place": "La taberna del ancla rota",
  "name": "Lo que se ve condensado",
  "title": "[Título de la historia (opcional)]",
  "description": "[Lo que se ve desde el lugar: un párrafo, ≤ 300 caracteres]",
  "meeting": [
    "[Encuentro: acercamiento, imágenes, diálogos (3–8 párrafos, 900–5000 caracteres): párrafo 1 de 3]",
    "[Encuentro: acercamiento, imágenes, diálogos (3–8 párrafos, 900–5000 caracteres): párrafo 2 de 3]",
    "[Encuentro: acercamiento, imágenes, diálogos (3–8 párrafos, 900–5000 caracteres): párrafo 3 de 3]",
    "[Encuentro: termina en una pregunta o situación de decisión, ¿…?]"
  ],
  "accept": {
    "name": "[Acción de aceptar]",
    "description": "[La acción, lo que piensas o sus consecuencias (≤ 250 caracteres)]"
  },
  "reject": {
    "name": "[Acción de rechazar]",
    "description": "[La acción, lo que piensas o sus consecuencias (≤ 250 caracteres)]"
  },
  "rejected": [
    "[Rechazo: consecuencia, despedida y separación (3–6 párrafos): párrafo 1 de 3]",
    "[Rechazo: consecuencia, despedida y separación (3–6 párrafos): párrafo 2 de 3]",
    "[Rechazo: consecuencia, despedida y separación (3–6 párrafos): párrafo 3 de 3]"
  ],
  "chapters": [
    {
      "id": "inicio",
      "name": "Capítulo inicial",
      "text": [
        "[Capítulo «Capítulo inicial»: párrafo 1 de 6]",
        "[Capítulo «Capítulo inicial»: párrafo 2 de 6]",
        {
          "text": "[Diálogo del personaje principal entre «comillas», con animación chatA]",
          "animation": "chatA"
        },
        "[Capítulo «Capítulo inicial»: párrafo 3 de 6]",
        "[Capítulo «Capítulo inicial»: párrafo 4 de 6]",
        "[Capítulo «Capítulo inicial»: párrafo 5 de 6]",
        "[Capítulo «Capítulo inicial»: el último párrafo plantea la decisión, ¿…?]"
      ],
      "options": [
        {
          "name": "[Acción 1]",
          "description": "[Qué haces, qué piensas o qué puede pasar (≤ 250 caracteres)]",
          "to": "a"
        },
        {
          "name": "[Acción 2]",
          "description": "[Qué haces, qué piensas o qué puede pasar (≤ 250 caracteres)]",
          "to": "b"
        }
      ]
    },
    {
      "id": "a",
      "name": "Rama A",
      "text": [
        "[Capítulo «Rama A»: párrafo 1 de 6]",
        "[Capítulo «Rama A»: párrafo 2 de 6]",
        {
          "text": "[Diálogo del personaje principal entre «comillas», con animación chatA]",
          "animation": "chatA"
        },
        "[Capítulo «Rama A»: párrafo 3 de 6]",
        "[Capítulo «Rama A»: párrafo 4 de 6]",
        "[Capítulo «Rama A»: párrafo 5 de 6]",
        "[Capítulo «Rama A»: el último párrafo plantea la decisión, ¿…?]"
      ],
      "options": [
        {
          "name": "[Acción 1]",
          "description": "[Qué haces, qué piensas o qué puede pasar (≤ 250 caracteres)]",
          "to": "a1"
        },
        {
          "name": "[Acción 2]",
          "description": "[Qué haces, qué piensas o qué puede pasar (≤ 250 caracteres)]",
          "to": "a2"
        }
      ]
    },
    {
      "id": "b",
      "name": "Rama B",
      "text": [
        "[Capítulo «Rama B»: párrafo 1 de 6]",
        "[Capítulo «Rama B»: párrafo 2 de 6]",
        {
          "text": "[Diálogo del personaje principal entre «comillas», con animación chatA]",
          "animation": "chatA"
        },
        "[Capítulo «Rama B»: párrafo 3 de 6]",
        "[Capítulo «Rama B»: párrafo 4 de 6]",
        "[Capítulo «Rama B»: párrafo 5 de 6]",
        "[Capítulo «Rama B»: el último párrafo plantea la decisión, ¿…?]"
      ],
      "options": [
        {
          "name": "[Acción 1]",
          "description": "[Qué haces, qué piensas o qué puede pasar (≤ 250 caracteres)]",
          "to": "b1"
        },
        {
          "name": "[Acción 2]",
          "description": "[Qué haces, qué piensas o qué puede pasar (≤ 250 caracteres)]",
          "to": "b2"
        }
      ]
    },
    {
      "id": "a1",
      "name": "Final A1 (vuelve al lugar del NPC)",
      "text": [
        "[Capítulo «Final A1 (vuelve al lugar del NPC)»: párrafo 1 de 6]",
        "[Capítulo «Final A1 (vuelve al lugar del NPC)»: párrafo 2 de 6]",
        "[Capítulo «Final A1 (vuelve al lugar del NPC)»: párrafo 3 de 6]",
        "[Capítulo «Final A1 (vuelve al lugar del NPC)»: párrafo 4 de 6]",
        "[Capítulo «Final A1 (vuelve al lugar del NPC)»: párrafo 5 de 6]",
        "[Capítulo «Final A1 (vuelve al lugar del NPC)»: párrafo 6 de 6]"
      ]
    },
    {
      "id": "a2",
      "name": "Final A2 (termina en la ciudad)",
      "text": [
        "[Capítulo «Final A2 (termina en la ciudad)»: párrafo 1 de 6]",
        "[Capítulo «Final A2 (termina en la ciudad)»: párrafo 2 de 6]",
        "[Capítulo «Final A2 (termina en la ciudad)»: párrafo 3 de 6]",
        "[Capítulo «Final A2 (termina en la ciudad)»: párrafo 4 de 6]",
        "[Capítulo «Final A2 (termina en la ciudad)»: párrafo 5 de 6]",
        "[Capítulo «Final A2 (termina en la ciudad)»: párrafo 6 de 6]"
      ],
      "end": {
        "city": "Valdoria"
      }
    },
    {
      "id": "b1",
      "name": "Final B1 (termina en un lugar)",
      "text": [
        "[Capítulo «Final B1 (termina en un lugar)»: párrafo 1 de 6]",
        "[Capítulo «Final B1 (termina en un lugar)»: párrafo 2 de 6]",
        "[Capítulo «Final B1 (termina en un lugar)»: párrafo 3 de 6]",
        "[Capítulo «Final B1 (termina en un lugar)»: párrafo 4 de 6]",
        "[Capítulo «Final B1 (termina en un lugar)»: párrafo 5 de 6]",
        "[Capítulo «Final B1 (termina en un lugar)»: párrafo 6 de 6]"
      ],
      "end": {
        "place": "La taberna del ancla rota"
      }
    },
    {
      "id": "b2",
      "name": "Final B2 (vuelve al lugar del NPC)",
      "text": [
        "[Capítulo «Final B2 (vuelve al lugar del NPC)»: párrafo 1 de 6]",
        "[Capítulo «Final B2 (vuelve al lugar del NPC)»: párrafo 2 de 6]",
        "[Capítulo «Final B2 (vuelve al lugar del NPC)»: párrafo 3 de 6]",
        "[Capítulo «Final B2 (vuelve al lugar del NPC)»: párrafo 4 de 6]",
        "[Capítulo «Final B2 (vuelve al lugar del NPC)»: párrafo 5 de 6]",
        "[Capítulo «Final B2 (vuelve al lugar del NPC)»: párrafo 6 de 6]"
      ]
    }
  ]
}


---

# Encargo

Escribe un NPC o evento nuevo para «Puente de los faroleros» de «Vado Ámbar», con su historia completa: un árbol de capítulos de 3 niveles (7 capítulos y 4 finales). Elige el destino de cada final con sentido.

Idea: un músico que toca para el río

# Contexto del juego

## La ciudad: Vado Ámbar

### Descripción (versión 1)
Una ciudad levantada junto al único vado del río Lento, con casas de piedra rojiza y ventanas de ámbar que tiñen de miel la luz de cada calle. Sus resineros sangran los pinos del valle desde hace siglos.

### Descripción (versión 2)
Nació como una posada de carreteros junto al vado y creció a fuerza de resina: cada muro guarda un trozo de ámbar, y en los dinteles se leen los nombres de los gremios que la fundaron.

### Viaje de llegada (versión 1)
El camino baja entre pinos altos, con las cortezas marcadas por cortes en forma de espiga. De cada herida cuelga un cuenco de barro que se llena despacio de resina dorada, y el aire huele a savia, a humo dulce y a madera recién partida.

Al salir del bosque aparece el río Lento, ancho y quieto, con el agua del color del té. En su único vado, una hilera de piedras planas lo cruza de orilla a orilla, y sobre ellas se levanta la ciudad: tejados escalonados, chimeneas finas y ventanas que brillan como gotas de miel.

Cruzas por la calle de los Cuencos, donde los resineros cuelgan sus calderos frente a las puertas. Una mujer remueve la resina hirviendo con una pala larga y, sin levantar la vista, te señala el camino hacia la plaza con la barbilla. Nadie aquí tiene prisa: en Vado Ámbar todo se hace al ritmo en que gotea un pino.

En la plaza del Gremio, la fuente es un bloque de ámbar tallado del tamaño de un carro. Dentro, atrapados desde antes de que existiera la ciudad, se ven insectos, semillas y una pluma entera. Los niños apoyan la frente en la piedra para mirarlos, y los viejos dicen que quien la toca al llegar siempre encuentra el camino de vuelta.

Cuando el sol baja, las ventanas de ámbar se encienden desde dentro y la ciudad entera cambia de color. Sobre el río, el largo puente de piedra empieza a llenarse de pequeñas luces, una tras otra, y el olor a resina quemada se mezcla con el de la cena. Te detienes un momento a mirar: es fácil entender por qué los carreteros nunca quisieron irse.

### Viaje de llegada (versión 2)
Llegas con la niebla de la mañana todavía pegada al río. Primero se oye la ciudad y después se ve: el golpe de las hachas en el bosque, el chapoteo de los barqueros, una campana pequeña que llama a los resineros al trabajo.

Las piedras del vado asoman entre la bruma como lomos de animales dormidos. Los carros las cruzan despacio, con el agua hasta los ejes, cargados de toneles sellados con cera. Un carretero te deja subir al pescante y cruzas con él, oyendo cómo el río empuja las ruedas sin ganas.

En la otra orilla, las casas parecen hechas del mismo río: piedra rojiza abajo, madera oscura arriba y ventanas de ámbar en todos los pisos. Sobre cada puerta hay un sello del gremio que la construyó, y algunos están tan gastados que solo se adivina la forma de un pino o de un cuenco.

Subes por la calle de los Cuencos entre calderos humeantes. El olor dulce de la resina se te mete en la ropa y en el pelo, y una niña te ofrece por una moneda un trocito de ámbar con una hormiga dentro. «Lleva cien años quieta», dice, muy seria, como si le hablara a la hormiga.

Desde la plaza del Gremio se ve el puente largo que cruza el río aguas abajo del vado, con sus faroles todavía apagados. La ciudad se despierta del todo a tu alrededor, sin ruido y sin prisa, y sientes que aquí cualquier camino termina, tarde o temprano, junto al agua.

## El lugar: Puente de los faroleros

### Descripción (versión 1)
Un puente de once arcos sobre el río Lento, con un farol de resina en cada pilar. Al caer la tarde, los faroleros los encienden uno a uno con largas pértigas.

### Descripción (versión 2)
Lo construyeron los resineros para no depender del vado en las crecidas. Sus faroles arden con la peor resina de la ciudad, la que no se vende, y se ven desde el bosque.

### Entrada (versión 1)
El puente empieza donde terminan las casas, con una rampa de piedra gastada por siglos de ruedas. Once arcos lo sostienen sobre el agua oscura, y en cada pilar se levanta un poste de hierro con un farol de cristal ahumado, todavía apagado.

Caminas sobre losas pulidas, tan lisas que reflejan el cielo de la tarde. El río pasa por debajo sin ruido, y solo se le oye cuando choca contra los tajamares, con un murmullo largo que sube por la piedra y se te mete en los pies.

A medida que cae el sol, aparecen los faroleros. Llevan pértigas con una mecha encendida en la punta y un cubo de resina colgado del cinturón. Van de farol en farol sin hablar, y cada luz que prenden deja en el aire un olor dulce y un hilo de humo amarillo.

Desde el centro del puente se ve toda la ciudad encendida detrás de ti, con sus ventanas de ámbar, y delante el río que se pierde entre los pinos. Las barcas pasan bajo los arcos con un farol en la proa, y los barqueros saludan hacia arriba sin mirar a quién.

### Entrada (versión 2)
Llegas al puente cuando ya es casi de noche. La mitad de los faroles arden y la otra mitad esperan, y el puente parece un collar al que todavía le faltan cuentas.

La piedra guarda el calor del día y huele a musgo y a resina vieja. En los pretiles hay nombres grabados a cuchillo, fechas de bodas y de crecidas, y en uno de ellos, una raya profunda marca hasta dónde llegó el agua el año en que el río se llevó el vado.

Los faroleros trabajan en silencio, cada uno con su tramo. Uno silba bajito mientras sube la mecha; otra se apoya en el pretil a mirar las barcas antes de seguir. Nadie te pregunta qué haces allí: el puente es de todos y, de noche, sobre todo de quien no tiene prisa.

Bajo tus pies, el río Lento brilla con los reflejos de cada farol, como si debajo del agua hubiera otro puente igual, encendido al revés. Te quedas quieto un momento y la ciudad entera parece contener la respiración contigo.

## NPCs que ya están en el lugar (crea uno distinto)

- **Anciana con pértiga y farol** (Los faroles que se apagan): En el arco del medio, una anciana encorvada sostiene una pértiga encendida frente a un farol apagado. Lo mira como si el farol le debiera algo.

## Destinos posibles para los finales

Por defecto, un final vuelve a «Puente de los faroleros». También puede terminar en otro lugar de Vado Ámbar (`"end": { "place": "…" }`) o en otra ciudad: Valdoria (La taberna del ancla rota).
