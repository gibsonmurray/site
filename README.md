# Gibson Murray

A rearrangeable, bento-style Next.js portfolio for Gibson Murray. The public
site is a small App Router app with widgets for writing, books, projects, social
profiles, music, and contact.

## Widget design system

The widget contract lives in `lib/widget-design.ts`. It defines the shared card,
surface, typography, accent, and detail primitives, plus four content-density
rules:

| Size  | Role    | Content contract                    |
| ----- | ------- | ----------------------------------- |
| `1x1` | Compact | Identity and title                  |
| `2x1` | Wide    | Identity, summary, and side preview |
| `1x2` | Tall    | Vertical story, preview, and action |
| `2x2` | Large   | Full preview, details, and action   |

Widgets read these capabilities when rendering, so small cards do not render
content that only gets hidden later. Component-specific styling uses inline
Tailwind utilities; `app/global.css` only loads Tailwind and declares source
paths. The grid library keeps its required vendor styles.

## Scripts

- `bun run dev` starts Next.js with Turbopack.
- `bun run build` creates the production Next build.
- `bun run start` serves the production build locally.
- `bun run lint` checks the active Next source.
- `bun run ts` runs the TypeScript checks without emitting files.
