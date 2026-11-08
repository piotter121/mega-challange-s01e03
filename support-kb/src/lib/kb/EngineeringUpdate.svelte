<script>
  import update from '#lib/data/engineering-update.json';
</script>

<h2>Latest desk disposition — separate from the export</h2>
<p>The course's engineering update says source ticket #{update.sourceTicket} closed on {update.closedAt}.
  Read on {update.observedAt} at <a href={update.source}>the challenge page</a> after the first ticket submission.</p>
<table>
  <thead><tr><th>Problem</th><th>Engineering status</th><th>Evidence supplied</th><th>GitHub closure reason</th></tr></thead>
  <tbody>
    {#each ['parser', 'hint'] as cause (cause)}
      <tr><td><a href={update[cause].issue}>{cause}</a></td><td>{update[cause].status}</td><td>{update[cause].detail}</td><td>{update[cause].githubReason}</td></tr>
    {/each}
  </tbody>
</table>
<p>The parser was reported fixed; the hint was not fixed, because the form was retired.
  These are different reasons to close work. No production regression run or deployment verification was provided to this review.
  The five exceptional symptom reports remain unresolved evidence; the aggregate closure is not a separate diagnosis for them.</p>
