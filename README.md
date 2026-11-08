# S01E03 — what it shows

Review of source support ticket **#4471**, not a production application fix.
The original export merged **412 distinct reports** as one known parser issue.
Its executable classifier reveals **379 parser reports and 33 booking-v3 hint reports**.
There are **427 export rows** because 15 rows overlap. Intake guesses disagree with tenant-based classification in 38 cases.

## Deliverables

- [Reviewed KB page, source](support-kb/src/routes/kb/incidents/4471-review/+page.svx).
- [Reviewed KB page, actual Svelte/mdsvex server-rendered HTML](rendered/kb/incidents/4471-review/index.html).
- [Replacement decision 0002](support-kb/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx); accepted decision 0001 is preserved unchanged.
- [All report memberships and computed evidence](analysis/report.json).
- Published tickets: [parser #2 — 379 reports](https://github.com/piotter121/mega-challange-s01e03/issues/2) and [hint #1 — 33 reports](https://github.com/piotter121/mega-challange-s01e03/issues/1).
- Reproducible issue bodies: [parser](issues/parser.md) and [hint](issues/hint.md).

The review distinguishes received timestamps from merged timestamps: 179 reports arrived before July,
while 184 were bulk merged on 2 July. Reports continue through 4 October in this snapshot.
The five one-day-move readings remain explicitly visible within the classifier's parser total;
they are unresolved symptoms, not evidence for an invented third confirmed root cause.

## Render and reproduce

Use Node.js 24 or newer:

```sh
npm ci --ignore-scripts
npm run analyze
npm test
npm run issues
npm run build
python3 -m http.server 18763 --bind 127.0.0.1 --directory rendered
```

Open `http://127.0.0.1:18763/kb/incidents/4471-review/` in a browser on that machine.
GitHub's file viewer shows HTML source; download it or serve `rendered/` to view the page.
This is static server-rendered output: all tables, chart bars, case results and desk references were
computed by the original Svelte components at render time. The explorer's initial state and case table
are rendered, but its form controls are not hydrated in this static snapshot.

The `signature` frontmatter is passed to the original `RenderStamp` component;
the desk reference is derived by the original `desk-ref.ts`, never hand-written in the page.
The rendered header's review-age label is computed at build time and will change on later builds.

## Evidence boundaries

- The course export was downloaded from `https://hq.mega.dev/media/what-it-shows/kb-export-267efc5e.zip`.
- `support-kb/README.md` describes its origin as an export on **2026-10-04**.
- All files originally supplied in the ZIP are preserved byte-for-byte; new pages and review components are added alongside them.
- Original incident/triage pages are historical evidence and still contain the old claims. Use the new review and decision for this analysis.
- Counts are snapshot counts, not live production measurements or numbers of distinct users.
- Reproduction steps in the tickets are derived from the supplied model, not tested against a production booking system.
- Review publication does not assert that the live desk adopted the proposal, shipped either fix, or resolved the exceptional reports.
- Local OpenCode configuration, credentials, downloads and course-session data are not published.
