// Consejos: mensajes cortos, uno por idea, mezclados en un muro.
//
// Los que vienen de fábrica son de la casa y van sin firma, igual que el resto
// del catálogo. El campo `autor` es para lo que aporta la gente: quien manda un
// consejo aparece con su usuario y su enlace, que es todo el pago que hay aquí.
//
// Para añadir uno: copia un bloque, ponlo en su grupo y escríbelo en los dos
// idiomas. Nada más. Si te falta el inglés, dilo en la pull request y se traduce.

export const CONSEJO_GRUPOS = [
  { key: 'agente', label: { es: 'Con tu agente', en: 'With your agent' } },
  { key: 'oficio', label: { es: 'Oficio', en: 'Craft' } },
  { key: 'git', label: { es: 'Git', en: 'Git' } },
  { key: 'empezar', label: { es: 'Empezar', en: 'Getting started' } },
  { key: 'web', label: { es: 'Diseño web', en: 'Web design' } },
]

export const CONSEJOS = [
  // ---------- Con tu agente ----------
  { id: 'no-tocar', grupo: 'agente',
    es: 'Dile qué **no** tocar. Sin fronteras te reescribe media base de código para arreglar un botón.',
    en: 'Tell it what **not** to touch. With no fences it rewrites half your codebase to fix one button.' },

  { id: 'deberia-funcionar', grupo: 'agente',
    es: '«Debería funcionar» no es «funciona».',
    en: '"It should work" is not "it works".' },

  { id: 'pide-la-salida', grupo: 'agente',
    es: 'Que no te resuma la prueba: que te pegue la salida del comando tal cual salió.',
    en: 'Do not let it summarise the test run. Ask for the raw command output, exactly as it came out.' },

  { id: 'tres-intentos', grupo: 'agente',
    es: 'Tres intentos fallidos seguidos no se arreglan con un cuarto. Se arreglan replanteando el problema.',
    en: 'Three failed tries in a row are not fixed by a fourth. They are fixed by reframing the problem.' },

  { id: 'porque-no-solo-codigo', grupo: 'agente',
    es: 'Si te da el código sin decirte por qué, no sabes si lo eligió o si fue lo primero que le salió.',
    en: 'If it hands you code without saying why, you cannot tell whether it chose that or just went first-thing-first.' },

  { id: 'ensena-el-diff', grupo: 'agente',
    es: 'Que te enseñe el diff antes de aplicarlo. Aceptar a ciegas es exactamente igual que no revisar.',
    en: 'Have it show the diff before applying it. Accepting blind is exactly the same as not reviewing.' },

  { id: 'cuentale-el-porque', grupo: 'agente',
    es: 'Cuéntale para qué es, no solo qué quieres. Un agente que entiende el porqué acierta mucho más.',
    en: 'Tell it what the thing is for, not just what you want. An agent that knows the why gets it right far more often.' },

  { id: 'contexto-corto', grupo: 'agente',
    es: 'Una tarea por conversación. Cuando el hilo se llena de intentos viejos, arrastra sus propios errores como si fueran datos.',
    en: 'One task per conversation. Once the thread fills with old attempts, it drags its own mistakes along as if they were facts.' },

  { id: 'no-le-creas-el-arreglado', grupo: 'agente',
    es: 'Cuando diga «arreglado», ábrelo tú. Es la frase que más veces resulta ser mentira sin querer.',
    en: 'When it says "fixed", go look yourself. That is the sentence that most often turns out to be accidentally false.' },

  { id: 'agy-sin-preguntas', grupo: 'agente',
    es: 'Si el CLI de Antigravity (`agy`) te pide permiso para cada comando, prueba `--mode auto` (Windows 11 24H2 o posterior): aprueba lo seguro y pregunta antes de lo irreversible. `--dangerously-skip-permissions` quita **todos** los avisos, también los que te salvan.',
    en: 'If the Antigravity CLI (`agy`) asks permission for every command, try `--mode auto` (Windows 11 24H2 or later): it approves the safe stuff and still asks before anything irreversible. `--dangerously-skip-permissions` turns off **every** prompt, including the ones that save you.' },

  // ---------- Oficio ----------
  { id: 'nombre-documentacion', grupo: 'oficio',
    es: 'Si necesitas un comentario para explicar qué guarda una variable, el nombre está mal puesto.',
    en: 'If you need a comment to say what a variable holds, the name is the thing that is wrong.' },

  { id: 'error-entero', grupo: 'oficio',
    es: 'La línea que importa de un error casi nunca es la primera. Léelo entero antes de tocar nada.',
    en: 'The line that matters in an error is almost never the first one. Read it all before touching anything.' },

  { id: 'borrar-es-avanzar', grupo: 'oficio',
    es: 'Borrar código es avanzar.',
    en: 'Deleting code is progress.' },

  { id: 'nada-comentado', grupo: 'oficio',
    es: 'No dejes código muerto comentado «por si acaso». Para acordarse está git.',
    en: 'Do not leave dead code commented out just in case. That is what git is for.' },

  { id: 'explicalo-en-voz-alta', grupo: 'oficio',
    es: 'Si no sabes explicarlo en voz alta, todavía no lo has entendido.',
    en: 'If you cannot explain it out loud, you have not understood it yet.' },

  { id: 'se-lee-mas', grupo: 'oficio',
    es: 'El código se lee muchas más veces de las que se escribe. Optimiza para el que lo lea.',
    en: 'Code gets read far more often than it gets written. Optimise for whoever reads it.' },

  { id: 'reproduce-primero', grupo: 'oficio',
    es: 'Antes de arreglar un fallo, consigue repetirlo a voluntad. Lo que no sabes provocar, no sabes si lo has arreglado.',
    en: 'Before fixing a bug, make it happen on demand. What you cannot trigger, you cannot prove you fixed.' },

  { id: 'un-cambio-cada-vez', grupo: 'oficio',
    es: 'Cambia una cosa y prueba. Dos cambios a la vez y ya no sabes cuál fue.',
    en: 'Change one thing, then test. Two at once and you no longer know which one did it.' },

  { id: 'lo-raro-es-tuyo', grupo: 'oficio',
    es: 'Cuando algo «no tiene sentido», el fallo casi siempre es tuyo, no del lenguaje.',
    en: 'When something "makes no sense", the bug is almost always yours, not the language\'s.' },

  { id: 'nombra-lo-que-hace', grupo: 'oficio',
    es: 'Una función que necesita la palabra «y» para explicarse hace dos cosas.',
    en: 'A function that needs the word "and" to explain itself is doing two things.' },

  // ---------- Git ----------
  { id: 'un-cambio-un-commit', grupo: 'git',
    es: 'Un cambio, un commit. Cuando algo se rompa vas a querer saber cuál de los siete fue.',
    en: 'One change, one commit. When something breaks you will want to know which of the seven did it.' },

  { id: 'mensaje-por-que', grupo: 'git',
    es: 'El mensaje dice **por qué**. El qué ya está en el diff.',
    en: 'The message says **why**. The what is already in the diff.' },

  { id: 'add-p', grupo: 'git',
    es: '`git add -p` te obliga a mirar trozo a trozo lo que subes. Nunca más un archivo de más.',
    en: '`git add -p` makes you look at what you are staging, chunk by chunk. Never another stray file.' },

  { id: 'rama-antes-de-force', grupo: 'git',
    es: 'Antes de un force push, respira y mira en qué rama estás.',
    en: 'Before a force push, breathe and check which branch you are on.' },

  { id: 'commitea-antes-de-probar', grupo: 'git',
    es: 'Cuando algo funcione, commitea. Aunque esté a medias. Volver atrás vale más que un historial bonito.',
    en: 'When something works, commit it. Even half-done. Being able to go back beats a pretty history.' },

  { id: 'nada-de-secretos', grupo: 'git',
    es: 'Una clave subida ya es pública, aunque borres el commit. Cámbiala, no la escondas.',
    en: 'A pushed key is already public, even if you delete the commit. Rotate it, do not hide it.' },

  // ---------- Empezar ----------
  { id: 'termina-algo-feo', grupo: 'empezar',
    es: 'Termina algo feo antes que empezar algo bonito.',
    en: 'Finish something ugly before starting something pretty.' },

  { id: 'saltar-de-lenguaje', grupo: 'empezar',
    es: 'Saltar de lenguaje no es avanzar: es volver a empezar con otro nombre.',
    en: 'Hopping to another language is not progress: it is starting over under a new name.' },

  { id: 'tutorial-que-no-acaba', grupo: 'empezar',
    es: 'El tutorial que no acaba en algo tuyo no cuenta como aprender.',
    en: 'A tutorial that does not end in something of your own does not count as learning.' },

  { id: 'dos-horas-atascado', grupo: 'empezar',
    es: 'Si llevas dos horas atascado, el problema ya no es técnico. Levántate.',
    en: 'If you have been stuck for two hours, the problem is no longer technical. Get up.' },

  { id: 'copia-y-entiende', grupo: 'empezar',
    es: 'Copiar está bien. Copiar sin entender es lo que te deja atascado en el siguiente fallo.',
    en: 'Copying is fine. Copying without understanding is what strands you at the next bug.' },

  { id: 'proyecto-que-te-importe', grupo: 'empezar',
    es: 'Elige un proyecto que te importe de verdad. Es lo único que te hará volver el martes por la noche.',
    en: 'Pick a project you actually care about. It is the only thing that brings you back on a Tuesday night.' },

  { id: 'lo-basico-aburre', grupo: 'empezar',
    es: 'Lo básico aburre porque funciona. Lo que brilla en un vídeo casi nunca es lo que usas a diario.',
    en: 'The basics are boring because they work. What shines in a video is rarely what you use every day.' },

  // ---------- Diseño web ----------
  { id: 'transform-opacity', grupo: 'web',
    es: 'Anima `transform` y `opacity`. Todo lo demás obliga a recalcular la maquetación en cada fotograma, y ahí se van los 60fps.',
    en: 'Animate `transform` and `opacity`. Anything else forces a relayout every frame, and that is where your 60fps go.' },

  { id: 'la-cajita', grupo: 'web',
    es: 'Si tu texto vive dentro de una cajita redondeada, pregúntate qué está haciendo la cajita.',
    en: 'If your text lives inside a little rounded box, ask yourself what the box is doing.' },

  { id: 'contraste-antes-que-color', grupo: 'web',
    es: 'Antes de elegir la paleta, comprueba que se lee. Un gris bonito ilegible sigue siendo ilegible.',
    en: 'Before picking the palette, check it can be read. A pretty unreadable grey is still unreadable.' },

  { id: 'movil-primero-de-verdad', grupo: 'web',
    es: 'Móvil primero de verdad significa abrirlo en el móvil, no encoger la ventana del escritorio.',
    en: 'Mobile first really means opening it on a phone, not shrinking the desktop window.' },

  { id: 'sin-js-tambien', grupo: 'web',
    es: 'Si tu página necesita JavaScript para mostrar un párrafo, algo se ha torcido por el camino.',
    en: 'If your page needs JavaScript to show a paragraph, something went sideways along the way.' },

  { id: 'la-fuente-pesa', grupo: 'web',
    es: 'Cada tipografía que cargas es tiempo en blanco para quien entra. Dos pesos suelen bastar.',
    en: 'Every font you load is blank time for whoever lands. Two weights are usually enough.' },
]

// Un texto muy corto se lee como un cartel y uno largo como una nota: el muro
// respira si no todos pesan igual, así que el tamaño sale de la longitud.
export function tamanoDe(texto) {
  const n = texto.replace(/[*`]/g, '').length
  if (n <= 52) return 'corto'
  if (n <= 96) return 'medio'
  return 'largo'
}
