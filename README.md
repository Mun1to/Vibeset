<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="redesign/public/brand/logo-blanco.svg">
  <img alt="Vibeset" src="redesign/public/brand/logo-negro.svg" width="104">
</picture>

### One place with everything you need to build for the web

100 programming languages, 83 frontend tools, 41 design techniques, 24 live components,
19 component analysis cards, 19 agent skills and 38 tips, plus an MCP server for agents. Free, bilingual, no sign-up, no tracking.

<a href="https://vibeset.dev">
  <img alt="Open vibeset.dev" src=".github/assets/boton-open.svg" width="268">
</a>

**English** · [Español](README.es.md)

</div>

---

## Why it exists

Learning to build for the web means fighting the search before you fight the problem. What language
fits what you want to make. Which of the forty tools that do the same thing is worth the afternoon.
What that effect on someone else's site is called. What to tell your coding agent so it stops
guessing.

The answers exist, scattered across bookmarks, threads and tutorials that expired two years ago.

Vibeset puts them in one place, and shows them instead of describing them: real data instead of
opinions, code that runs instead of screenshots, effects you can grab by the knobs instead of a
video of someone else using them. It is free and it stays free, it works without an account, and it
does not track you. Two languages, because the good stuff should not be locked behind English.

It is not a course and it does not want to be. It is the shelf you check before you start.

## What is inside

**100 languages.** Year, creator, paradigm, popularity, extensions, ecosystem, pros and cons, and a
code example that shows what the thing actually looks like. Search by name, use case or extension
(`.py`, `.rs`), filter by category, compare up to three side by side, or take a short quiz that
recommends one based on what you want to build, your level and what you value.

**83 frontend resources.** The tools that are worth the afternoon: AI interface generators, ready
made blocks, CSS frameworks, component libraries, animation, icons, colour, backgrounds, typography
and inspiration.

**41 web design concepts.** Parallax, smooth scroll, scroll-driven animations, 3D tilt, glassmorphism,
View Transitions, container queries, Core Web Vitals and more. Each one with what it is, what it is
for, and a copyable example of the smallest code that makes it work.

**24 live components.** Cloth, peel, ASCII, dithering, chromatic bloom, emboss and more, each one
running at full size with its controls exposed. Move the knobs and copy the code with your values
already in it. The ones written for Vibeset are MIT: the sliding pill header, the FAQ accordion,
the matryoshka parallax and a growing set of small text and micro-interaction pieces written from
scratch; the rest are third-party effects, each crediting and linking its author.

**19 component analysis cards.** React Bits components we have read through: when to use each one,
what it costs, what its code says about accessibility, the prompt to ask your agent for it and its
install command. They have no demo and no code on purpose. React Bits is MIT with Commons Clause,
which forbids redistributing the components themselves, so Vibeset links the original instead of
copying it. Where we have written our own piece that does something similar, from scratch, the
analysis sits at the foot of that piece's page instead of being a card of its own.

**19 agent skills.** Instructions you hand your coding agent once and it knows for good: check a
screen on mobile, audit accessibility, review a diff, debug down to the root cause, write a commit
message. Copy the `SKILL.md`, drop it in its folder, or install the six published as plugins with
two commands: `/plugin marketplace add Mun1to/Vibeset` and then `/plugin install <name>@vibeset`.

**38 tips.** Short things you learn by losing afternoons, ours and whatever people send in. Open to
contributions through a pull request.

## Use it from your agent (MCP)

Vibeset also speaks MCP, so a coding agent can search the catalogue and pull install commands
without leaving the editor. It is read-only: it serves the metadata and, for third-party
components, the install command from their own registry. It never rehosts anyone else's code.

Point any MCP client at the remote endpoint:

```bash
npx mcp-remote https://vibeset.dev/api/mcp
```

Four tools: `search` (components, skills, concepts, tips and resources, filtered by house criteria),
`get_item` (a whole skill, a concept with its prompt, or a component's install command),
`list_registries`, and `search_icons` (Iconify: ~334k open-source icons, each with its licence). The same
catalogue is also a shadcn registry at `https://vibeset.dev/r/registry.json`, one item per
`/r/{name}.json`, with the English half under `/r/en/`.

Full reference, with tool examples and client setup, in **[MCP.md](MCP.md)**.

## Stack

React 19, Vite, React Router, Tailwind CSS v4, Framer Motion and Lucide. Two of the effects use
three.js and load only when you look at them. No backend, no database, no accounts, no analytics:
everything runs in your browser and nothing leaves it.

Every section and every entry has its own address, so any of them can be linked and shared:
`/languages/rust`, `/components/cloth`, `/skills/finito`.

The interface and all the content are bilingual, including the code examples. The theme starts on
the one your system uses and the header can override it.

## Run it locally

```bash
git clone https://github.com/Mun1to/Vibeset.git
cd Vibeset/redesign
pnpm install
pnpm dev
```

Then open the address it prints. `pnpm build` writes the production site to `dist/`.

The live site is the React app in `redesign/`. The `index.html` at the repository root is the
original vanilla version, kept as history and no longer served.

## Deployment

Cloudflare Pages, from `main`. Root directory `redesign`, build `pnpm install && pnpm build`,
output `dist`. Custom domain `vibeset.dev`.

## Contributing

This is meant to grow with other people: a component, a resource, a concept, a skill, a fix, a
better translation. Open an issue or a pull request. Small ones are welcome, and so is telling me
something here is wrong.

## Licence

**Take the code. Take the knowledge. Credit if you republish. Never take the name.**

- **Code is [MIT](LICENSE).** Grab a component, build your site, sell it. **No credit needed**, no
  link, nothing. That is what it is here for.
- **Written material** (the language profiles, the resource entries, the concept explanations, the
  text of the skills) is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Use it for
  yourself freely. **Credit only if you republish it** for other people to read, and then use it for
  anything, commercial included.
- **The name Vibeset, the logo and the domain** are not licensed. No forks called Vibeset, and no
  `vibeset.xyz`, `vibeset.io` or anything close enough to be mistaken for it.
- **If you fork the whole thing:** rename it, drop the brand assets, and put the credit where it can
  be seen. That is a licence term, not a favour.
- **The effects in `canvasui/` and `arlan/` are not mine.** They are here with credit and a link;
  to reuse them, go to their authors. **React Bits is not here at all:** its licence forbids
  redistributing the components, so there are only analysis cards that link to the original.

Building your site with what you found here needs no permission and no mention. Full details in
**[LICENSING.md](LICENSING.md)**, name policy in **[TRADEMARK.md](TRADEMARK.md)**.

## Don't trust it, check it

Open source only helps if somebody actually reads the code, and almost nobody does. So instead of
asking you to trust this project, here is the prompt to check it: point your own AI agent at this
repository and get a security report, in your language, in a few minutes, even if you do not know
how to program.

**[Open AI-AUDIT.md](AI-AUDIT.md)** and paste it into Claude Code, Codex, Cursor, Copilot or
whatever you use. It is the same prompt in every public repository here, so you can compare.

---

<div align="center">

Built by [Munir Torres](https://github.com/Mun1to) · [vibeset.dev](https://vibeset.dev)

</div>
