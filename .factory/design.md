# Visual thesis: the evidence bench

Trajectory Test Cases uses **neo-brutalist utility** as a visual analogue for a
CI workbench: fixtures are pinned down, events are numbered like evidence tags,
and failures are marked with blunt inspection ink. The interface should feel
purpose-built for engineers reading operational evidence—not like a generic
developer landing page.

## Palette

- `charcoal #171713`: primary ink and dark theme ground.
- `paper #F3F0E6`: warm fixture-paper background; less clinical than white.
- `chalk #FFFDF5`: raised surface.
- `signal #D7331A`: failure/action orange-red, with white text where filled.
- `wire #3856E8`: dependency-edge blue; selected controls use white on this blue.
- `acid #D7F541`: pass/highlight marker with charcoal text.
- `muted #64645B`: secondary text on paper (contrast checked above 4.5:1).
- semantic danger uses `#B82B19` on light and `#FF8A74` on dark; warning uses
  dark text on acid. State always includes a symbol and label, never color alone.

In the dark treatment the signal shifts to `#FF6B50` and uses charcoal text.
The site has deliberate light and dark treatments, selected from system
preference with a persistent user toggle. Borders are solid charcoal/cream,
not shadow-heavy glass or gradients.

## Type and rhythm

The display face is the local system grotesk stack (`Arial Black`, `Arial`,
sans-serif), set tightly and in sentence case. Code, metadata, and event numbers
use the local monospace stack (`ui-monospace`, `SFMono-Regular`, `Consolas`). No
fonts or scripts are fetched at runtime. The scale is 16, 18, 24, 40, and
clamp(48–88) px. Body copy has 1.55 leading and a 68-character measure.

Spacing follows a 4/8 px rhythm. Major bands use 64–112 px; controls are at
least 44 px. Desktop uses an offset 12-column bench; at 390 px the demo stacks,
secondary annotations collapse, and no action depends on hover.

## Interaction grammar and depth

Controls are rectangular hardware: 2 px borders, 0–3 px offset shadows, and a
one-pixel pressed translation. Focus is a 3 px wire-blue outline plus 3 px
offset. Event chips behave like pinned labels. Changing a demo fixture redraws
the same inspection lane so the relationship between input and evidence stays
clear. Keyboard users can tab to examples and run with Enter/Space.

Motion is limited to 180 ms transform/opacity for control presses and newly
evaluated trace rows. Nothing loops. Under `prefers-reduced-motion: reduce`,
transitions and animations become instant while layering, numbering, and labels
preserve hierarchy.

## Original asset plan and provenance

The hero uses one original generated bitmap: an editorial, top-down evidence
bench of paper trajectory cards, cobalt dependency wire, vermilion fault stamp,
and acid-green pass tab. It explains partial order at a glance and leaves text
out so the HTML remains accessible and crisp. It is generated specifically for
this product with `/opt/fleet/lib/gen-image.sh` using the factory image
deployment, then converted to responsive WebP variants at no more than 300 KB.
The final prompt and deployment metadata live beside the source image under
`.factory/assets/`; optimized responsive derivatives ship from
`site/public/assets/`. License: project-owned generated asset under the MIT
repository license. UI icons and the wordmark are hand-made with CSS/HTML; no
stock assets are used.

## Voice

Short, factual, and test-oriented: “Trace passed”, “Missing call”, “Run this
fixture”. The site always states that trajectory conformance does not establish
answer quality, correctness, or safety.
