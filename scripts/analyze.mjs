import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { causeOf, groupByCause, uniqueById } from '../support-kb/src/lib/kb/causes.ts';

export const root = fileURLToPath(new URL('../', import.meta.url));
const dataRoot = path.join(root, 'support-kb/src/lib/data');
export const raw = JSON.parse(fs.readFileSync(path.join(dataRoot, 'reports-4471.json')));
export const tenants = fs.readdirSync(path.join(dataRoot, 'tenants')).sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(dataRoot, 'tenants', name))));
export const tenantOf = (report) => tenants.find((tenant) => tenant.handle === report.tenant);
export const reports = uniqueById(raw).filter((report) => report.mergedInto === 4471);
export const groups = groupByCause(reports, tenantOf);
export const notes = JSON.parse(fs.readFileSync(path.join(dataRoot, 'desk-notes.json')));

export function analyze() {
  return {
    snapshot: '2026-10-04',
    ticket: 4471,
    rawRows: raw.length,
    distinctReports: reports.length,
    overlapRows: raw.length - reports.length,
    method: 'Unmodified causes.ts: last export row per ID, tenant locale via Intl.DateTimeFormat, form and channel; not intake tags.',
    groups: groups.map(({ reports: members, ...group }) => ({ ...group, count: members.length, reportIds: members.map((r) => r.id) })),
    mismatchedIntakeTags: reports.filter((r) => causeOf(r, tenantOf(r)) !== r.meta.intakeTag).map((r) => r.id),
    oneDayMove: notes.oneDayMove.map((id) => ({ ...reports.find((r) => r.id === id), classifierCause: causeOf(reports.find((r) => r.id === id), tenantOf(reports.find((r) => r.id === id))) })),
    receivedMonths: Object.fromEntries([...new Set(reports.map((r) => r.receivedAt.slice(0, 7)))].sort().map((month) => [month, reports.filter((r) => r.receivedAt.startsWith(month)).length])),
    receivedBeforeJuly: reports.filter((r) => r.receivedAt < '2026-07-01').length,
    mergedOnJuly2: reports.filter((r) => r.mergedAt?.startsWith('2026-07-02')).length,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.mkdirSync(path.join(root, 'analysis'), { recursive: true });
  fs.writeFileSync(path.join(root, 'analysis/report.json'), JSON.stringify(analyze(), null, 2) + '\n');
  console.log(groups.map((g) => `${g.cause}: ${g.reports.length}`).join('\n'));
}
