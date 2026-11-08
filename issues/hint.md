# [hint] booking-v3 shows MM/DD/YYYY to day-first tenants — 33 reports

## Scope and count

**33 unique reports** from the export of source ticket **#4471**, received 2026-04-17 through 2026-09-22; 3 tenants. The source ticket number is not a GitHub issue number. Counts are from the 2026-10-04 snapshot, not a claim about current traffic.

The booking-v3 form prints MM/DD/YYYY but interprets input in the day-first tenant format. People following the hint can therefore get the wrong date even though the shared-parser defect is tracked separately. The affected form tenants are alder.physio (de-DE), copper.studio (es-ES), and pale.harbour (pt-PT). Their app/email reports do not belong to this hint group.

## Reproduction inferred from the supplied behavior

Use the booking-v3 form as alder.physio. For an intended 6 August, follow the displayed MM/DD/YYYY hint and enter 08/06/2026. A day-first interpretation reads 8 June. Expected: the hint and actual parsing agree, and the intended 6 August is retained.

No production application was provided or tested. The reproduction follows the executable KB classifier and its comments, not a successful live reproduction.

## Evidence and classification

- Run `npm run analyze` and `npm test`. Classification uses the supplied, unmodified `causes.ts`, tenant directory, locale order via Intl, form version and intake channel.
- Intake tags in this group: parser: 15; hint: 18. Browser locale/intake labels and matching subjects are not a reliable merge rule.
- Deduplicate by ID, retaining the last occurrence as the supplied code does. The export has 427 rows, 412 unique IDs and 15 overlapping rows. Two cause groups partition those IDs: parser 379 + hint 33 = 412.
- Full membership and cross-checks: [analysis/report.json](https://github.com/piotter121/mega-challange-s01e03/blob/main/analysis/report.json).
- Review source: [4471-review/+page.svx](https://github.com/piotter121/mega-challange-s01e03/blob/main/support-kb/src/routes/kb/incidents/4471-review/+page.svx).
- Desk-visible rendered page: [HTML](https://github.com/piotter121/mega-challange-s01e03/blob/main/rendered/kb/incidents/4471-review/index.html).

## Examples (reporters' words)

- **R-41230**, copper.studio, form: My client came on 1 June instead of 6 January. We sorted it out.
- **R-41241**, alder.physio, form: We had two people show up on 8 June. They were booked for 6 August.
- **R-41251**, pale.harbour, form: Wednesday 7 January showed as Wednesday 1 July. I moved it myself.

## Acceptance criteria

- Make the displayed hint, validation and parsing agree for the tenant locale.
- Test booking-v3 form submission for all three affected tenants, including an ambiguous date and a day above twelve.
- Check booking-v2, app/email and month-first locale controls separately.
- Verify the submitted date survives to the invite and reminder; a parser-only fix is not sufficient evidence.

## Report IDs (33, no overlap with the other cause)

<details><summary>Full report-ID membership</summary>

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584

</details>
