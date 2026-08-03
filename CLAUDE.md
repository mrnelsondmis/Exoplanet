# Mystery Planet Database — working notes

## Baking in data changes
The user edits content through the site's own admin pages (Add Log, Departments,
Situations, Planet Profile, Telemetry), which save to their browser's local storage.
That does NOT reach students on the live GitHub site.

When the user says "bake it in" (or similar), do this:

1. Read their current data from the live preview with `eval_js_user_view`:
   `exo-logs`, `exo-log-edits`, `exo-logs-removed`, `exo-logs-hidden`, `exo-log-order`,
   `exo-depts`, `exo-tags`, `exo-telemetry-v3`, `exo-situations`,
   `exo-profile`, `exo-profile-notes`, `exo-profile-published`
2. Write those values into the defaults in `logs-data.js`
   (`BASE_LOGS`, `DEFAULT_DEPTS`, `DEFAULT_TAGS`, `DEFAULT_TELEMETRY`,
   `DEFAULT_SITUATIONS`, `DEFAULT_PROFILE`, `DEFAULT_PUBLISHED`).
   Apply `exo-log-order` by reordering `BASE_LOGS` and renumbering ids sequentially.
3. Bump the `exo-baseline-vN` key at the top of `logs-data.js` (v5 → v6 → …) so every
   browser drops its stale saved copy and picks up the new code.

The user declined splitting content into a separate editable data file; they prefer
this bake-in loop.

## Site facts
- Admin password: `colony2187`. Admin pages: central-command (telemetry), add-log,
  departments, situations, planet-profile-admin. Public: index, all-logs, department,
  situation-room, planet-profile.
- Log numbering (`LOG-01`…) and situation numbering (`SIT-01`…) are positional —
  set by drag order, not stored in the id.
- Planet Profile figures stay hidden behind a per-row "release to students" flag.
- Planet Profile units: imperial (miles, °F), except mass and gravity, which are metric.
- Design vocabulary is the site's own dark terminal look — do not restyle it to a
  bound design system.
