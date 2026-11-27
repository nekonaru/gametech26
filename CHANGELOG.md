## v2.0.0

An experience and mechanics update with stealth, crafting, a new chapter, and a clearer interface.

## New features

- **Stealth chapter.** Chapter b22 adds patrol routes, a detection meter, hide zones, and ending 12.
- **Crafting.** Recipes from `recipes.json` can be assembled in a new inventory panel.
- **Locked choices.** Dialog options whose conditions are not met stay visible with a short reason.
- **Design tokens.** Focus rings, motion tokens, and reduced motion support are applied across the interface.

## Improvements

- **Detection feedback.** The HUD shows detection and hidden status with a compact meter.
- **Save compatibility.** Old saves gain default values for new variables when loaded.
- **Interaction polish.** Buttons have active states and modal panels use a consistent entrance animation.

## Bug fixes

- **Dialog identity.** Choices without a target node still resolve to the correct option.
- **Listener hygiene.** Inventory craft buttons reuse one bound handler instead of stacking listeners.

## v1.1.0

A content and reliability update that adds a new chapter, a shadow chase mechanic, and fixes across saves, input, audio, UI, and rendering.

## New features

- **Shadow lane chapter.** Chapter b21 adds a new `lorong_bayang` scene and ending 11 with Indonesian and English dialogue.
- **Shadow chase.** New `startChase` and `stopChase` script ops spawn a follower that reacts to player proximity and is disabled in Narrative Mode and Soft Horror.
- **Joystick side setting.** The saved left or right joystick choice now changes the touch control zones.

## Improvements

- **Deterministic visuals.** Grain time uses real frame delta, dynamic ticks no longer skip a callback, and the visual regression baseline is stable across runs.
- **Leaner render loop.** Camera, lighting, and scene visibility checks reuse scratch objects or throttle DOM reads, and shared textures are no longer disposed between scenes.
- **Cleaner teardown.** Render subsystems, window listeners, and settings subscriptions are released on dispose, with audio context listeners and game globals handled too.
- **Safer content validation.** `loadScene` now requires a real chapter id, and dialog choices with `onSelect` but no target node execute correctly.

## Bug fixes

- **Save validation.** IndexedDB failures fall back to localStorage, and load rejects malformed or checksum-mismatched saves.
- **Touch input.** Separate touch identifiers keep movement and look working together, and rebinds swap collided keys instead of silently dropping one.
- **Audio.** Procedural sounds respect spatial options and unique source ids, and window listeners are removed on dispose.
- **Phone and UI.** The phone clock interval and stacked listeners are stopped, the key rebind listener can be cancelled, and the prologue skip listener is detached on hide.
- **Script flow.** Stale operation chains stop after a chapter change, and tension events emit only when the value changes.
