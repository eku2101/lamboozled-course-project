# Working on the group project

1. Review the demo and wireframe. Agree on module ownership at the first meeting.
2. Pick one small task and state what the player should be able to do when it is complete.
3. Create a branch, for example `codex/m04-reading` or `codex/m03-evidence`.
4. Keep changes in your module where possible. Coordinate `core.js`, `app.js`, `index.html`, shared styles, and engine/data contracts with the other owners.
5. Run `node check.mjs` and `node --test test-game.mjs`. Try the changed flow in a browser, including keyboard access and large text when relevant.
6. Open a pull request explaining the change and how it was checked. Ask a teammate to review it before merging.

Public visitors can inspect and fork the code. Direct push access requires the repository owner to add collaborators in GitHub's repository settings. Sharing a link alone does not grant editing access.

## Suggested review pairs

- A reviews B's card changes; B reviews A's game-flow changes.
- C reviews D's guide and layout changes; D reviews C's response and access tools.
- Everyone helps with full-round and device testing. D coordinates integration.

## Preserve these behaviors

- A turn can include one optional action, then a draw or drop.
- One drop requires everyone to drop; no further draws or actions in that phase.
- Evidence points determine the round winner. Each tied round winner receives one round point.
- Accessibility tools and optional guide use never change points.
- Dictation is opt-in, editable, and never auto-submits.
- Private hands stay hidden during handover and when leaving the game view.
- Keep sample content and demo-specific rule choices labeled.

Do not commit credentials, provider keys, private player information, or rights correspondence. Add actual publisher content only with an appropriate permission basis.
