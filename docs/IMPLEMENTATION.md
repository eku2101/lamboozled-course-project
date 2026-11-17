# LAMBOOZLED! — Playable course demo

A child-friendly, local pass-and-play game for 2–6 people sharing one device. The setup, turn choices, shared drop, evidence points, and round ties follow the two rule-card photos supplied by the user. All news, context, evidence, artwork, and action-card text are original sample content. The three action effects are explicitly labeled samples and were authorized by the user; this is not an official digital edition.

## Run and play

From the repository root, open `dist/index.html`, or run `node serve.mjs` and visit http://127.0.0.1:4173. No install, API key, or build is needed. The hosted demo and wireframe are publicly accessible by link.

1. Choose 2–6 players, nicknames, and a demo finish of 3 or 5 round wins.
2. Deal: one news card, four context cards, and five evidence/action cards per player.
3. Pass the device. Only reveal the current player’s hand when others look away.
4. Optionally play one action, then draw a card OR drop a Real/Fake evidence case.
5. A drop forces everyone else to drop. No more actions or draws. Cases stay hidden until all are submitted.
6. Discuss the cases. Matching evidence is initially checked; players can agree to change which cards count.
7. Award the round: highest evidence total wins one round point. Tied winners each receive one. Continue until the demo target is reached.

Explanations may be spoken to the group, typed, or dictated. Typing is optional. There is no timer and no automatic true/false grade. Pip is a scripted, optional thinking guide, not a live AI. Guide use never affects points; reading/voice access is not counted as AI help.

## Rule choices not specified in the supplied photos

- Sample actions: **Extra clues** draws up to two; **Sneaky sheep** takes one random card from another player; **Flock swap** exchanges hands after discarding the played action. The player must still draw or drop afterward.
- One shared device. Hands are hidden at handover, when leaving the game view, and when the page becomes hidden. This is a social privacy screen, not a secure multi-user boundary against developer tools.
- First to 3 or 5 round wins. Starting player rotates each round. Joint match winners are possible.
- Fresh shuffled sample decks each round. Three original stories cycle without repeating until the story queue empties. Four of six context categories are revealed.
- No mid-round recycling. If the evidence/action deck empties, players must drop. An unusable extra-draw action is not consumed.
- Empty cases can be submitted after an explicit zero-point confirmation, so players with no matching evidence are never stuck. Equal highest totals—including zero—tie.
- Evidence applicability uses the news/context facts in the sample data. Players review those suggestions together before scoring. The guide does not adjudicate.

These choices are labeled in Welcome and How to play. Confirm them and the actual action-card effects before describing this as a complete reproduction of the original game.

## Four-person ownership

| Member | Modules | Ownership |
| --- | --- | --- |
| A | M01 + M07 | Setup, handovers, turns, game engine, drop, scoring, match end, reflection |
| B | M02 + M03 | News/context, card data, private hands, evidence, sample action interfaces |
| C | M04 + M05 | Read-aloud/highlighting, reading settings, typed/spoken responses, deliberate submission |
| D | M06 + M08 | Scripted guide, content records, team board, shared shell, integration and QA |

Each member hands off two modules, acceptance checks, and an integration note. All four test devices and accessibility. A reviews B; B reviews A; C reviews D; D reviews C. D coordinates shared HTML/CSS. Rebalance if a package proves larger than expected.

`dist/wireframe.html` is a self-contained, printable layout and handoff. The Team blueprint screen allows browser-local owner/status assignments and plan export. Assignments do not synchronize between users.

## Source map and contracts

- `dist/game-engine.js`: UI-independent game class, owned by A with B reviewing card mechanics. Constructor takes card data and an optional seeded random generator for tests. No DOM or network.
- `dist/cards.js`: original stories, six context categories, nine evidence templates, and three labeled sample actions. Five copies of each evidence/action template make a 60-card mixed deck. Unique IDs are assigned per round.
- `dist/core.js`: `LB` event bus, utilities, game instance, refresh/error/confirmation helpers.
- `dist/app.js`: routing, tool-panel placement, modal close controls, and hand privacy on navigation/visibility change.
- `dist/modules/01-lobby.js` through `08-team.js`: paired module ownership as above.
- `dist/styles.css`, `playful.css`, `game.css`: base layout, sheep/newspaper visual theme, compact game UI.
- `dist/assets/`: original SVG sheep and clue illustrations. No publisher artwork is bundled.

Engine phases: `lobby → handoff → turn → handoff/drop → review → result → next round`, with `finished` when the chosen target is reached. A first drop creates an all-player submission queue starting with that player. Scoring is allowed only once, after every case is in.

Main commands: `start`, `reveal`, `hide`, `draft`, `draw`, `action`, `submit`, `count`, `award`, `nextRound`. Mutations validate phase, card ownership, side consistency, duplicate selections, action limits, and score timing.

Each player owns `hand`, `draft: {side, ids, reasoning}`, `guideEnabled`, `guideUses`, and cumulative `score`. Cases copy submitted cards and guide history. A draft is preserved across draws/handovers and filtered if an action changes ownership. Round history includes scored cases and optional reflection.

UI events: `game:changed` rerenders modules; `draft:changed` updates hand and selected totals; `reading:toggle`, `reading:evidence`, `reading:stop` control speech; `voice:stop` stops dictation; `view:changed` stops media when navigating. Reading requests carry `{text,node}`; the DOM node is local-only and is never serialized.

## Verification

Run `node check.mjs` for JavaScript syntax and referenced assets. Run `node --test test-game.mjs` for 15 rule tests: 2–6-player dealing, draw handover, all sample actions, card conservation, invalid targets, forced drops, contextual values, invalid selections, score-once, human review, ties, match ending, empty decks, draft privacy, and complete seeded matches.

Browser walkthroughs cover dealing, private handovers, sample action then draw, evidence selection, guide opt-in, typed reasoning, dictation consent/cancel, the all-player drop, evidence review, scoring and ties. Speech recognition requires browser/device permission and a supported service; actual microphone recording must be checked on the group’s devices. Voice availability and word-boundary support vary. Sentence highlighting follows speech start/end events; word highlighting uses browser boundary events when available. Browser QA is not accessibility conformance certification.

## Data and content

No app server, accounts, remote rooms, analytics, or model calls. Match state, nicknames, responses, and guide history exist in memory until reload, restart, or export. Only reading preferences and team assignments persist in local storage. Reloading clears a game; the browser warns before leaving an unfinished match where supported.

Read-aloud and browser speech recognition may use provider services. Dictation requires opt-in, remains editable, and never submits a case automatically. It stops before handover or navigation; late callbacks cannot write into the next player’s response.

Digitization/AI permission for the official deck remains unconfirmed. See Content & rights for the previously researched publisher guidance and unsent request draft. The uploaded rule photos were used as reference and are not bundled. Do not add actual card text/art or send it to a model without an appropriate permission basis. Original game credited to Ioana Literat, Yoo Kyung Chang and the Media and Social Change Lab, Teachers College, Columbia University; published by Teachers College Press.

Further extensions: actual approved card pack, confirmed original action effects, remote authoritative rooms, device/assistive-technology studies, and an optional institution-approved live AI adapter. These are separate from this playable local sample.
