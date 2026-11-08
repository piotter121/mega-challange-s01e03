import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import { causeOf, groupByCause, uniqueById, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export function review(ticket: number) {
  const raw = reports as Report[];
  const merged = uniqueById(raw).filter((r) => r.mergedInto === ticket);
  const groups = groupByCause(merged, tenantOf);
  const oneDayMove = merged.filter((r) => notes.oneDayMove.includes(r.id));
  const months = [...new Set(merged.map((r) => r.receivedAt.slice(0, 7)))].sort();
  const monthly = months.map((month) => ({
    month,
    received: merged.filter((r) => r.receivedAt.startsWith(month)).length,
  }));
  return {
    merged,
    groups,
    oneDayMove,
    monthly,
    overlaps: raw.filter((r) => r.mergedInto === ticket).length - merged.length,
    mismatches: merged.filter((r) => causeOf(r, tenantOf(r)) !== r.meta.intakeTag).length,
    julyBatch: merged.filter((r) => r.mergedAt?.startsWith('2026-07-02')).length,
    beforeJuly: merged.filter((r) => r.receivedAt.slice(0, 10) < '2026-07-01').length,
  };
}
