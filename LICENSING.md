# Licensing

Vibeset is not under a single licence, because it is not a single kind of work. The code, the
catalogue and the brand are different things, and each one has its own rules.

The `LICENSE` file at the root holds the MIT text on its own, with nothing added, so GitHub and
automated tools detect it correctly. **It covers the source code only.** This document is the full
map: read it before reusing anything that is not code.

**The short version: take the code, take the knowledge, credit if you republish, never take the
name.**

| What | Licence | You may |
| --- | --- | --- |
| Source code written for Vibeset | [MIT](LICENSE) | Copy it, modify it, ship it commercially. No credit required. |
| Catalogue content and written material | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Use it freely; credit Vibeset when you republish it. |
| Name, logo and domain | Not licensed | Nothing. See [Brand and name](#brand-and-name). |
| Third-party effects bundled here | Their authors' terms | See [Third-party code](#third-party-code). |

## Which one applies to me?

Most people who land here want a component or an idea for their own site. That case needs nothing
at all: no permission, no credit, no link. Find your case:

| What you are doing | What you owe |
| --- | --- |
| Taking a component and putting it in your site | **Nothing.** |
| Copying the whole app to learn from it or use it privately | **Nothing.** |
| Copying a skill into your own `.claude/skills/` | **Nothing.** |
| Shipping a paid product built with code from here | **Nothing** beyond the copyright notice MIT already asks you to keep in the source. |
| Applying something you learned here to your own work | **Nothing.** Knowledge is not licensed. |
| Republishing the language profiles, concept explanations or skill text for other people to read | Credit with a link. |
| Translating the catalogue and publishing it | Credit with a link. |
| Publishing a fork of the site | A different name, no brand assets, visible credit. |
| Calling your project Vibeset, or registering `vibeset.xyz` | **Not allowed.** See [Brand and name](#brand-and-name). |

The line is simple: **using it is free, republishing it is credited, the name is off limits.**

---

## Source code — MIT

Everything written for this project: the React application, the views, the components built for
Vibeset, the build configuration and the scripts.

Take a component, take the whole app if it is useful to you. Ship it in a commercial product. The
only condition is the one MIT already states: keep the copyright notice in the source files you
copied.

**You do not have to credit Vibeset anywhere your users can see.** No badge, no footer line, no
link. Building your site with a component from here is exactly what the code is published for.

## Catalogue content — CC BY 4.0

The written material and the curated data:

- every language profile (descriptions, uses, pros and cons, code examples),
- every resource entry,
- every web design concept and its examples,
- every agent skill, including the body of every `SKILL.md`,
- the interface copy in both languages.

The grant covers the catalogue as it stands on the day you read this, entries added later
included. It is deliberately not written as a count: a number goes stale the week after it is
typed, and a licence that says "the 64 resource entries" leaves the sixty-fifth in the dark.

**Take it.** Copy it, translate it, adapt it, teach with it, build a product on top of it and charge
for that product. Knowledge that only one site is allowed to hold is worth less than knowledge that
travels, and this is meant to travel.

**Reading it, learning from it and applying it costs nothing and requires nothing.** Facts are not
owned: that Python came out in 1991, or that `will-change` should be removed once the animation
ends, is not mine and never was. Use what you learn here wherever you want, without a word about it.

The condition kicks in when you **republish the written material itself** for other people to read:
the profiles, the explanations, the examples, the skill instructions, copied or adapted. Then, and
only then, **credit Vibeset with a visible link.** Not buried in a footer nobody scrolls to, not in
a comment in the source. Where a reader can see it.

Suggested wording, in whatever language you publish in:

```
Content from Vibeset by Munir Torres — https://vibeset.dev — CC BY 4.0
```

Full licence text: <https://creativecommons.org/licenses/by/4.0/legalcode>

## Brand and name

**Vibeset**, the Vibeset logo, the icons in `redesign/public/brand/` and the domain `vibeset.dev`
are the identity of this project. They are **not covered by any licence here**, and no permission to
use them is granted, expressly or by implication. This is the one line that does not move.

You may not:

- **Publish anything under the name Vibeset.** Not a fork, a mirror, a rebuild, an app, an extension
  or a service.
- **Register a domain built on the name.** `vibeset.xyz`, `vibeset.io`, `vibeset.app`,
  `getvibeset.com`, `vibeset.es` and anything of that shape are off limits, as are misspellings and
  near-copies (`vibesets`, `vibe-set`, `viberset`) that a reader could mistake for this project.
- **Use the logo or the icons** as the identity of your project, product, service or account.
- **Open accounts** on GitHub, npm, social platforms or app stores under that name.
- **Suggest affiliation.** No "official", no "powered by Vibeset", no wording that implies this
  project endorses, sponsors or maintains yours.

You may always, without asking: **name Vibeset to refer to Vibeset.** Link to it, review it, teach
with it, compare it, criticise it, say a component or a definition came from here. That is what the
name is for, and no permission is needed for it.

## If you fork this

Forking is welcome. Three conditions, and none of them is a favour:

1. **Rename it.** Choose your own name and remove the assets in `redesign/public/brand/`. The code
   runs fine without them. Nothing in your fork should read "Vibeset" as if it were yours.
2. **Credit it, where it can be seen.** In your README, and in the interface itself if you publish
   the site. A visible link to <https://vibeset.dev>.
3. **Keep the notices.** The copyright notice in the code, and the credits the third-party effects
   carry to their own authors.

This is not a courtesy request. Credit is a term of the licence: CC BY requires attribution for the
content in any medium, and MIT requires the copyright notice to travel with the code. A fork of
Vibeset carries both, so it carries the credit.

Suggested line for a fork:

```
Based on Vibeset by Munir Torres — https://vibeset.dev
```

## Third-party code

Some visual effects in this repository were **not written for Vibeset** and are not Munir's to
license. They are kept in their own folders, unmodified except where noted in the source comments:

| Folder | Author | Source |
| --- | --- | --- |
| `redesign/src/components/canvasui/` | canvasui | <https://canvasui.dev> |
| `redesign/src/components/arlan/` | Arlan | <https://arlan.me/vault> |

Neither author ships a licence file with the code they publish. They distribute it for people to use
in their projects, but **the MIT licence of this repository does not extend to those files**. If you
want to reuse one of those effects, take it from the author's own site and follow their terms, not
these. Every third-party effect in Vibeset credits its source with a link on its page.

**React Bits is not in this repository, and that is deliberate.** It does publish a licence, and it
is restrictive: MIT with the Commons Clause, which lets you use its components in your own site or
product but forbids selling, sublicensing or redistributing the components themselves, alone, in a
bundle or as a ported version. Copying them into a public repository would be redistributing them
in a bundle. The component pages for React Bits therefore carry only **our own analysis** (when to
use the piece, what to watch for, what its code says about accessibility, a prompt to ask an agent
for it), which is catalogue content under CC BY, plus a link to the original and its install
command. No demo, no copy of the code, no copy of their preview media. If that ever changes it will
be because its author said so in writing, and this paragraph will change with it.

The components in `redesign/src/components/propios/` are the opposite case and were added on
2026-08-29: they were written for Vibeset, they are MIT like the rest of the code in this
repository, and there is no external author to credit. Their page links the source file instead of
an origin site.

Some of those pieces do something similar to a React Bits component, and that needs saying plainly.
They were **written from scratch**, with their own names and their own props, and none of the
original's implementation was copied or ported. To be exact about the process, because it is not a
formal clean-room: the same author wrote the analysis cards and the new pieces. The analysis only
recorded what an original declares (its props, its dependencies, its accessibility attributes), and
the downloaded copy of the original was deleted from the working machine before any of our own code
was written. Doing a similar thing is not porting it, and the page of each such piece carries, at the
foot, the analysis of the original with a link, so nobody takes ours for theirs. If the author of an
original believes one of ours is a port, say so in an issue and it will be taken down while it is
looked at.

The MCP server (`redesign/functions/api/mcp.js`) holds the same line. It serves the catalogue
metadata (CC BY) and the full body of the skills, but for third-party components it serves only
their origin install command, never the code in `canvasui/` or `arlan/`. Components written here are
declared MIT and point at their file in this repository. The same goes for the external registries
it federates: it indexes and links them, it does not rehost them.

The photographs in `redesign/public/demo/` come from [Lorem Picsum](https://picsum.photos) and are
only there to give the demos something to distort.

## Contributing

Contributions are welcome, and they are the point: this is meant to grow with them. By opening a
pull request you agree that your code goes in under MIT and your written content under CC BY 4.0,
the same terms as the rest.

## Questions

If a use you have in mind does not fit cleanly in any of the boxes above, open an issue and ask.
Permission for a specific case is easier to grant than to guess.

---

> **ES · Resumen.** Vibeset no tiene una sola licencia porque no es una sola cosa.
>
> **El código es MIT.** Coges un componente, lo metes en tu web y la vendes si quieres: **sin
> crédito, sin enlace, sin nada**. Para eso está publicado.
>
> **El material escrito es CC BY 4.0** (los lenguajes, los recursos, los conceptos, las skills y
> los textos, todos, también los que se añadan mañana). Leerlo, aprender de ello y aplicarlo no cuesta nada ni pide nada. La
> condición aparece solo si **republicas ese material** para que lo lea otra gente: entonces sí,
> **cita a Vibeset con un enlace visible**, y ya puedes usarlo para lo que sea, comercial incluido.
>
> **El nombre, el logo y el dominio no se licencian**: no puedes llamar Vibeset a lo tuyo ni
> registrar vibeset.xyz, vibeset.io ni nada parecido. Si haces un fork del proyecto entero,
> cámbiale el nombre, quita el logo y pon el crédito donde se vea.
>
> Y ojo, **los efectos de `canvasui/` y `arlan/` no son míos**: están aquí con crédito y enlace,
> pero para reutilizarlos hay que ir a sus autores. Los de `propios/` sí lo son, y esos van con el
> resto del código: MIT, y te los llevas sin pedir permiso. **React Bits ni siquiera está aquí:** su
> licencia (MIT con Commons Clause) prohíbe redistribuir sus componentes, así que de él solo hay
> fichas de análisis nuestras (CC BY) que enlazan al original y dan su comando de instalación.
