<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="redesign/public/brand/logo-blanco.svg">
  <img alt="Vibeset" src="redesign/public/brand/logo-negro.svg" width="104">
</picture>

### Un sitio con todo lo que necesitas para construir en la web

100 lenguajes de programación, 83 herramientas de frontend, 41 técnicas de diseño,
18 componentes en vivo, 25 fichas de análisis de componentes, 19 skills de agente y 38 consejos,
más un servidor MCP para agentes. Gratis, bilingüe, sin registro y sin rastreo.

<a href="https://vibeset.dev">
  <img alt="Abrir vibeset.dev" src=".github/assets/boton-abrir.svg" width="268">
</a>

[English](README.md) · **Español**

</div>

---

## Por qué existe

Aprender a construir en la web es pelearse con la búsqueda antes que con el problema. Qué lenguaje
encaja con lo que quieres hacer. Cuál de las cuarenta herramientas que hacen lo mismo merece la
tarde. Cómo se llama ese efecto que has visto en otra web. Qué decirle a tu agente de código para
que deje de adivinar.

Las respuestas existen, repartidas entre marcadores, hilos y tutoriales que caducaron hace dos años.

Vibeset las reúne en un sitio, y en vez de describirlas las enseña: datos reales en lugar de
opiniones, código que funciona en lugar de capturas de pantalla, efectos que puedes coger por los
mandos en lugar de un vídeo de otro usándolos. Es gratis y va a seguir siéndolo, funciona sin cuenta
y no te rastrea. En dos idiomas, porque lo bueno no debería estar solo en inglés.

No es un curso ni quiere serlo. Es la estantería que miras antes de empezar.

## Qué hay dentro

**100 lenguajes.** Año, creador, paradigma, popularidad, extensiones, ecosistema, ventajas,
desventajas y un ejemplo de código que enseña de verdad qué pinta tiene. Busca por nombre, uso o
extensión (`.py`, `.rs`), filtra por categoría, compara hasta tres a la vez, o haz un test corto que
te recomienda uno según lo que quieras construir, tu nivel y lo que valoras.

**83 recursos de frontend.** Las herramientas que merecen la tarde: generadores de interfaces con
IA, bloques ya hechos, frameworks de CSS, librerías de componentes, animación, iconos, color, fondos,
tipografía e inspiración.

**41 conceptos de diseño web.** Parallax, smooth scroll, animaciones ligadas al scroll, tilt 3D,
glassmorphism, View Transitions, container queries, Core Web Vitals y más. Cada uno con qué es, para
qué sirve y un ejemplo copiable con lo mínimo que hay que escribir.

**18 componentes en vivo.** Tela, despegado, ASCII, tramado, brillo cromático, relieve y más, cada
uno corriendo a tamaño real con sus mandos a la vista. Mueve los controles y copia el código con tus
valores ya puestos. Seis son nuestros y MIT, el header de píldora deslizante, el acordeón de
preguntas, la matrioska parallax, el texto con destello, el contador que sube y la frase con foco; el
resto son efectos de terceros, cada uno con el crédito y el enlace de su autor.

**25 fichas de análisis de componentes.** Componentes de React Bits que hemos leído por dentro: cuándo
usar cada uno, qué cuesta, qué dice su código de la accesibilidad, el prompt para pedírselo a tu agente
y su comando de instalación. No llevan demo ni código a propósito. React Bits es MIT con Commons
Clause, que prohíbe redistribuir los componentes en sí, así que Vibeset enlaza al original en vez de
copiarlo. Donde hemos escrito desde cero una pieza propia que hace algo parecido, el análisis va al pie
de la página de esa pieza en lugar de ser una tarjeta aparte.

**19 skills de agente.** Instrucciones que le das una vez a tu agente de código y ya se sabe para
siempre: revisar una pantalla en móvil, auditar accesibilidad, revisar un diff, depurar hasta la
causa real, escribir el mensaje de un commit. Copias el `SKILL.md`, lo pegas en su carpeta, o
instalas con dos comandos las seis que se publican como plugin: `/plugin marketplace add
Mun1to/Vibeset` y luego `/plugin install <nombre>@vibeset`.

**38 consejos.** Cosas cortas que se aprenden perdiendo tardes, las de la casa y las que aporta la
gente. Abierto a colaboradores por pull request.

## Úsalo desde tu agente (MCP)

Vibeset también habla MCP, así que un agente de código puede buscar en el catálogo y sacar los
comandos de instalación sin salir del editor. Es de solo lectura: sirve la metadata y, de los
componentes de terceros, el comando de instalación de su propio registry. Nunca rehospeda el código
de nadie.

Apunta cualquier cliente MCP al endpoint remoto:

```bash
npx mcp-remote https://vibeset.dev/api/mcp
```

Cuatro tools: `search` (componentes, skills, conceptos, consejos y recursos, filtrado por criterio de
la casa), `get_item` (una skill entera, un concepto con su prompt, o el comando de instalación de un
componente), `list_registries`, y `search_icons` (Iconify: unos 334k iconos open source, cada uno con
su licencia). El mismo catálogo es también un registry shadcn en
`https://vibeset.dev/r/registry.json`, un item por `/r/{name}.json`, con la mitad inglesa bajo
`/r/en/`.

Referencia completa, con ejemplos de las tools y la configuración de clientes, en **[MCP.md](MCP.md)**.

## Con qué está hecho

React 19, Vite, React Router, Tailwind CSS v4, Framer Motion y Lucide. Dos de los efectos usan
three.js y se descargan solo cuando los miras. Sin backend, sin base de datos, sin cuentas y sin
analítica: todo corre en tu navegador y nada sale de ahí.

Cada sección y cada ficha tienen su propia dirección, así que cualquiera se puede enlazar y
compartir: `/languages/rust`, `/components/cloth`, `/skills/finito`.

La interfaz y todo el contenido están en los dos idiomas, incluidos los ejemplos de código. El tema
arranca en el de tu sistema y el selector del header lo puede cambiar.

## Arrancarlo en tu ordenador

```bash
git clone https://github.com/Mun1to/Vibeset.git
cd Vibeset/redesign
pnpm install
pnpm dev
```

Abre la dirección que aparece. `pnpm build` deja el sitio de producción en `dist/`.

Lo que está en vivo es la app de React de `redesign/`. El `index.html` de la raíz del repositorio es
la versión vanilla original: se queda como historia y ya no se sirve.

## Despliegue

Cloudflare Pages, desde `main`. Root directory `redesign`, build `pnpm install && pnpm build`,
salida `dist`. Dominio propio `vibeset.dev`.

## Contribuir

Esto está pensado para crecer con más gente: un componente, un recurso, un concepto, una skill, un
arreglo, una traducción mejor. Abre un issue o una pull request. Las pequeñas también valen, y decir
que algo de aquí está mal, también.

## Licencia

**Coge el código. Coge el conocimiento. Cita si lo republicas. No toques el nombre.**

- **El código es [MIT](LICENSE).** Coge un componente, haz tu web y véndela. **Sin crédito, sin
  enlace, sin nada.** Para eso está.
- **El material escrito** (las fichas de los lenguajes, los recursos, las explicaciones de los
  conceptos, el texto de las skills) es
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es). Úsalo para ti sin pedir nada.
  **Cita solo si lo republicas** para que lo lea otra gente, y entonces úsalo para lo que quieras,
  comercial incluido.
- **El nombre Vibeset, el logo y el dominio** no se licencian. Ni forks llamados Vibeset, ni
  `vibeset.xyz`, ni `vibeset.io`, ni nada que se le parezca lo bastante como para confundirse.
- **Si haces un fork del proyecto entero:** cámbiale el nombre, quita los assets de marca y pon el
  crédito donde se vea. Eso es una condición de la licencia, no un favor.
- **Los efectos de `canvasui/` y `arlan/` no son míos.** Están aquí con crédito y enlace; para
  reutilizarlos, hay que ir a sus autores. **React Bits no está aquí en absoluto:** su licencia
  prohíbe redistribuir los componentes, así que solo hay fichas de análisis que enlazan al original.

Hacer tu web con lo que encuentres aquí no necesita permiso ni mención. Todo el detalle en
**[LICENSING.md](LICENSING.md)**, y el nombre en **[TRADEMARK.md](TRADEMARK.md)**.

## No te fíes, compruébalo

El código abierto solo sirve si alguien lo lee, y casi nadie lo hace. Así que en vez de pedirte que
te fíes de este proyecto, aquí tienes el texto para comprobarlo: apunta tu propia IA a este
repositorio y te da un informe de seguridad, en tu idioma, en unos minutos, aunque no sepas
programar.

**[Abre AI-AUDIT.md](AI-AUDIT.md)** y pega ese texto en Claude Code, Codex, Cursor, Copilot o lo que
uses. Es el mismo texto en todos los repositorios públicos de aquí, así que puedes comparar.

---

<div align="center">

Hecho por [Munir Torres](https://github.com/Mun1to) · [vibeset.dev](https://vibeset.dev)

</div>
