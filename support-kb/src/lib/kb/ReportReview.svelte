<script lang="ts">
  import { review } from '#lib/kb/review';
  let { ticket }: { ticket: number } = $props();
  const data = $derived(review(ticket));
</script>

<h2>Reconciliation and classification</h2>
<p><strong>{data.merged.length}</strong> distinct report IDs, after removing <strong>{data.overlaps}</strong> overlapping export rows.
  The tenant directory, locale date order and booking-form version determine the supplied classifier's result,
  not the browser locale or intake tag. <strong>{data.mismatches}</strong> intake tags disagree with that result.</p>
<table>
  <thead><tr><th>Cause</th><th>Reports</th><th>Intake: parser</th><th>Intake: hint</th><th>First received</th><th>Last received</th></tr></thead>
  <tbody>
    {#each data.groups as group (group.cause)}
      <tr><td>{group.cause}</td><td>{group.reports.length}</td><td>{group.taggedAs.parser ?? 0}</td><td>{group.taggedAs.hint ?? 0}</td><td>{group.firstSeen}</td><td>{group.lastSeen}</td></tr>
    {/each}
  </tbody>
</table>

<h2>Reception is not merger time</h2>
<p><strong>{data.beforeJuly}</strong> reports arrived before July. The desk merged <strong>{data.julyBatch}</strong> reports on 2 July.
  The merger spike is a backlog operation, not an incident onset. Reports continued arriving through the last date in this export;
  the label “known” and the queued fix do not establish resolution.</p>
<table>
  <thead><tr><th>Month received</th><th>Distinct reports</th></tr></thead>
  <tbody>{#each data.monthly as month (month.month)}<tr><td>{month.month}</td><td>{month.received}</td></tr>{/each}</tbody>
</table>

<h2>Exceptions: preserve the evidence</h2>
<p>The desk marked <strong>{data.oneDayMove.length}</strong> reports as one-day-move readings.
  They remain inside the parser total under the supplied tenant classifier, not an additional population.
  A one-day difference or an invite arriving before booking is not explained by a month/day swap.
  These are unresolved symptoms, not proof of a timezone bug or a third confirmed cause.</p>
<table>
  <thead><tr><th>ID</th><th>Tenant / channel</th><th>Reporter's words</th></tr></thead>
  <tbody>
    {#each data.oneDayMove as report (report.id)}
      <tr><td>{report.id}</td><td>{report.tenant} / {report.channel}</td><td>{report.body}</td></tr>
    {/each}
  </tbody>
</table>
<p>For each exception, recover the submitted date, original invite, calendar value, booking creation time,
  timezone and offset on both clients, and parser/form version. Reproduce before assigning a cause or moving its count.</p>
